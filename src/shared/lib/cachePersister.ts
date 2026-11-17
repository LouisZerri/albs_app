import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import { File, Paths } from 'expo-file-system';

/**
 * Enregistre le cache de données (et la file des cochages en attente) dans un fichier de l'app,
 * pour le retrouver au prochain lancement, même sans réseau.
 *
 * Un fichier plutôt qu'AsyncStorage : le cache dépasse le mégaoctet (tracés des lignes), au-delà
 * de ce qu'une entrée AsyncStorage relit de façon fiable sur Android.
 */
const cacheFile = () => new File(Paths.document, 'albs-cache.json');

/** Délai de regroupement : le cache change par rafales, on n'écrit qu'une fois le calme revenu. */
const WRITE_DELAY_MS = 1000;

export function createFilePersister(): Persister {
  let pending: PersistedClient | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  // Les écritures se suivent une à une : deux écritures simultanées du même fichier le corrompraient.
  let writing: Promise<void> = Promise.resolve();

  const flush = () => {
    timer = null;
    const snapshot = pending;
    pending = null;
    if (!snapshot) return;
    writing = writing
      .then(() => cacheFile().write(JSON.stringify(snapshot)))
      .catch(() => undefined); // disque plein, etc. : on retentera à la prochaine modification
  };

  return {
    persistClient: (client) => {
      pending = client;
      timer ??= setTimeout(flush, WRITE_DELAY_MS);
    },

    restoreClient: async () => {
      try {
        const file = cacheFile();
        if (!file.exists) return undefined;
        return JSON.parse(await file.text()) as PersistedClient;
      } catch {
        return undefined; // fichier illisible ou tronqué : on repart d'un cache vide
      }
    },

    removeClient: async () => {
      pending = null;
      if (timer) clearTimeout(timer);
      timer = null;
      await writing;
      try {
        const file = cacheFile();
        if (file.exists) file.delete();
      } catch {
        // rien à supprimer
      }
    },
  };
}
