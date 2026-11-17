import { useQuery } from '@tanstack/react-query';

import { fetchStationBonplans } from '../api';

/** Préfixe commun à tous les écrans de station (pour les mises à jour groupées). */
export const STATION_BONPLANS_PREFIX = ['bonplans', 'station'] as const;

export const stationBonplansKey = (stationId: number) =>
  [...STATION_BONPLANS_PREFIX, stationId] as const;

/** Une station et ses bons plans (carte + liste). */
export function useStationBonplans(stationId: number) {
  return useQuery({
    queryKey: stationBonplansKey(stationId),
    queryFn: () => fetchStationBonplans(stationId),
  });
}
