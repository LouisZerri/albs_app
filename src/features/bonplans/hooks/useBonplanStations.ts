import { useQuery } from '@tanstack/react-query';

import { fetchBonplanStations } from '../api';

export const BONPLAN_STATIONS_KEY = ['bonplans', 'stations'] as const;

/** Stations ayant des bons plans. Change rarement → cache de 5 min. */
export function useBonplanStations() {
  return useQuery({
    queryKey: BONPLAN_STATIONS_KEY,
    queryFn: fetchBonplanStations,
    staleTime: 1000 * 60 * 5,
  });
}
