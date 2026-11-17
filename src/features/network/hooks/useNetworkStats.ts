import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchNetworkStats } from '../api';
import { deriveStats } from '../lib/localProgress';
import { useMyProgress } from './useMyProgress';
import { usePlatforms } from './usePlatforms';

export const NETWORK_STATS_KEY = ['network', 'stats'] as const;

/**
 * Progression réseau de l'utilisateur (global + par ligne).
 *
 * Les compteurs sont recalculés sur le téléphone à partir de la progression locale : ils suivent
 * chaque cochage tout de suite, même hors ligne. Les statistiques du serveur fournissent le reste
 * (ligne à reprendre, défis) et servent de repli tant que l'index des quais n'est pas chargé.
 */
export function useNetworkStats() {
  const query = useQuery({
    queryKey: NETWORK_STATS_KEY,
    queryFn: fetchNetworkStats,
  });
  const progress = useMyProgress();
  const platforms = usePlatforms();

  const data = useMemo(
    () =>
      query.data && progress.data && platforms.data
        ? deriveStats(query.data, platforms.data, progress.data)
        : query.data,
    [query.data, progress.data, platforms.data],
  );

  return { ...query, data };
}
