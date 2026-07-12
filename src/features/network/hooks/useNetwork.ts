import { useQuery } from '@tanstack/react-query';

import { fetchNetwork } from '../api';

/** Géométrie du réseau (lignes + stations) pour la carte. Rarement changeant → cache long. */
export function useNetwork() {
  return useQuery({
    queryKey: ['network', 'geo'],
    queryFn: fetchNetwork,
    staleTime: 1000 * 60 * 60,
  });
}
