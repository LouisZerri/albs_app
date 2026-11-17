import { useAppQuery } from '@/shared/lib';

import { fetchNetwork } from '../api';

export const NETWORK_GEO_KEY = ['network', 'geo'] as const;

/** Géométrie du réseau (lignes + stations) pour la carte. Rarement changeant → cache long. */
export function useNetwork() {
  return useAppQuery({
    queryKey: NETWORK_GEO_KEY,
    queryFn: fetchNetwork,
    staleTime: 1000 * 60 * 60,
  });
}
