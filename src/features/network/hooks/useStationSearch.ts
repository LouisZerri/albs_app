import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchNetwork } from '../api';
import { searchStations } from '../lib/stationSearch';
import { NETWORK_GEO_KEY } from './useNetwork';

/**
 * Recherche de station par nom. S'appuie sur les données de la carte (même cache), chargées
 * seulement quand l'utilisateur commence à chercher.
 */
export function useStationSearch(query: string) {
  const searching = query.trim() !== '';
  const network = useQuery({
    queryKey: NETWORK_GEO_KEY,
    queryFn: fetchNetwork,
    staleTime: 1000 * 60 * 60,
    enabled: searching,
  });

  const hits = useMemo(
    () => searchStations(network.data?.stations ?? [], query),
    [network.data, query],
  );

  return { searching, hits, isPending: searching && network.isPending, isError: network.isError };
}
