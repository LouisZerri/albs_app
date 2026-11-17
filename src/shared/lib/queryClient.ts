import { QueryClient, type Mutation } from '@tanstack/react-query';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

import { ApiError, isNetworkError } from './ApiError';
import { createFilePersister } from './cachePersister';

const TOO_MANY_REQUESTS = 429;

/** Durée de vie des données gardées pour le hors-ligne. */
const OFFLINE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

// L'expiration du JWT est gérée dans `apiFetch` (renouvellement + rejeu) : rien à faire ici.
/** Fabrique le client de requêtes de l'app. (Une fabrique, pour pouvoir simuler un redémarrage dans les tests.) */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // 30 s : évite les refetch trop agressifs sur mobile
        // Jamais purgées de la mémoire : c'est ce qui permet de les relire (et de les enregistrer) hors
        // ligne. ⚠️ Ne pas mettre une durée ici : au-delà de ~24 jours elle dépasse la limite des
        // minuteries JavaScript et les données seraient effacées AUSSITÔT (bug attrapé par les tests).
        gcTime: Infinity,
        retry: (failureCount, error) => {
          // Inutile de réessayer sur une erreur client (4xx) : ça ne changera rien.
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

export const queryClient = createQueryClient();

/**
 * Une action attend-elle encore d'être envoyée au serveur ? (en pause faute de réseau, ou en cours.)
 * Ce sont elles qu'il faut enregistrer et relancer : une action « en cours » au moment où l'app est
 * tuée n'est pas arrivée, et la perdre reviendrait à perdre un cochage.
 */
export const isAwaitingSync = (mutation: Mutation) => mutation.state.status === 'pending';

/** Réglages d'enregistrement du cache sur le téléphone (lecture hors ligne + file d'actions). */
export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: createFilePersister(),
  maxAge: OFFLINE_MAX_AGE_MS,
  // À changer pour faire oublier l'ancien cache à tous les téléphones : forme des données devenue
  // incompatible, ou donnée corrigée côté serveur qu'il ne faut pas attendre (v2 : tracés nettoyés ; v3 : position des pôles par ligne).
  // ⚠️ La file des cochages en attente est enregistrée avec lui : elle est oubliée aussi.
  buster: 'v3',
  dehydrateOptions: {
    // On ne garde que des données valides (jamais une erreur ou un chargement en cours).
    shouldDehydrateQuery: (query) => query.state.status === 'success',
    shouldDehydrateMutation: isAwaitingSync,
  },
};

/**
 * Marque (`meta`) des actions gardées en file hors ligne (cochages, favoris). C'est elle que le
 * bandeau de synchronisation compte — pas une connexion ou un envoi de formulaire en cours.
 */
export const OFFLINE_QUEUE_META = { offlineQueue: true } as const;

/** Une action de la file hors ligne attend-elle encore d'être envoyée ? */
export const isQueuedOffline = (mutation: Mutation) =>
  mutation.options.meta?.offlineQueue === true && isAwaitingSync(mutation);

/**
 * Relance, dans l'ordre, les actions restées en attente (à appeler une fois le cache relu au
 * lancement). Elles s'envoient si le réseau est là, et se remettent en pause sinon.
 */
export function resumePendingMutations(client: QueryClient = queryClient): void {
  for (const mutation of client.getMutationCache().getAll()) {
    if (isAwaitingSync(mutation)) {
      void mutation.continue().catch(() => undefined);
    }
  }
}

/**
 * Politique de réessai d'une action à ne jamais perdre : sans réseau on réessaie indéfiniment
 * (la bibliothèque met l'action en pause jusqu'au retour de la connexion), une panne serveur
 * est retentée quelques fois, un refus (4xx) est définitif — sauf « trop de requêtes » (429), qui
 * est une simple demande d'attendre.
 */
export function retryUntilSynced(failureCount: number, error: unknown): boolean {
  if (isNetworkError(error)) return true;
  // 429 = le serveur demande de ralentir (plafond de cochages) : ce n'est pas un refus, on renverra.
  if (error instanceof ApiError && error.status === TOO_MANY_REQUESTS) return true;
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < 3;
}
