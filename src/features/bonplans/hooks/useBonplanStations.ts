import { useAppQuery } from '@/shared/lib';

import { fetchBonplanStations } from '../api';

export const BONPLAN_STATIONS_KEY = ['bonplans', 'stations'] as const;

/** Stations ayant des bons plans. Change rarement → cache de 5 min. */
export function useBonplanStations() {
  return useAppQuery({
    queryKey: BONPLAN_STATIONS_KEY,
    queryFn: fetchBonplanStations,
    staleTime: 1000 * 60 * 5,
  });
}
