import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSyncStatus } from '@/shared/hooks/useSyncStatus';

import { prefetchNetwork } from '../lib/offlinePrefetch';

/** Laisse l'app s'afficher et charger l'écran en cours avant de télécharger le reste. */
const START_DELAY_MS = 2000;

/**
 * Précharge tout le réseau en arrière-plan dès qu'il y a de la connexion, pour que chaque ligne
 * soit utilisable sous terre. Relancé à chaque retour du réseau ; sans effet si tout est à jour.
 */
export function useOfflinePrefetch(): void {
  const client = useQueryClient();
  const { online } = useSyncStatus();

  useEffect(() => {
    if (!online) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      // Un échec (réseau perdu en route…) n'a rien à signaler : on réessaiera au prochain retour du réseau.
      prefetchNetwork(client, () => cancelled).catch(() => undefined);
    }, START_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [client, online]);
}
