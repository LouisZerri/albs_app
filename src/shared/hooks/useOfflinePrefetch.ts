import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { OfflineTask } from '@/shared/lib';

import { useSyncStatus } from './useSyncStatus';

/** Laisse l'app s'afficher et charger l'écran en cours avant de télécharger le reste. */
const START_DELAY_MS = 2000;

/**
 * Télécharge en arrière-plan, dès qu'il y a de la connexion, ce qui doit rester utilisable sous
 * terre. Les tâches s'enchaînent une à une ; tout est relancé à chaque retour du réseau, et ne
 * coûte presque rien si les données sont à jour.
 *
 * @param tasks liste STABLE (constante de module), sinon le téléchargement repartirait à chaque rendu
 */
export function useOfflinePrefetch(tasks: readonly OfflineTask[]): void {
  const client = useQueryClient();
  const { online } = useSyncStatus();

  useEffect(() => {
    if (!online) return;

    let cancelled = false;
    const isCancelled = () => cancelled;
    const timer = setTimeout(async () => {
      for (const task of tasks) {
        if (cancelled) return;
        // Un échec (réseau perdu en route…) n'a rien à signaler : on réessaiera au prochain passage.
        await task(client, isCancelled).catch(() => undefined);
      }
    }, START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [client, online, tasks]);
}
