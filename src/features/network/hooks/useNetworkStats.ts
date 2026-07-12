import { useQuery } from '@tanstack/react-query';

import { fetchNetworkStats } from '../api';

export const NETWORK_STATS_KEY = ['network', 'stats'] as const;

/** Récupère la progression réseau de l'utilisateur (global + par ligne). */
export function useNetworkStats() {
  return useQuery({
    queryKey: NETWORK_STATS_KEY,
    queryFn: fetchNetworkStats,
  });
}
