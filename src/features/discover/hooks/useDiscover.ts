import { useAppQuery } from '@/shared/lib';

import { fetchGhostStations, fetchJourneys } from '../api';

// Clés sous « discover » : rafraîchies après chaque cochage (cf. useToggleStation).
export const JOURNEYS_KEY = ['discover', 'journeys'] as const;
export const GHOST_STATIONS_KEY = ['discover', 'ghost-stations'] as const;

/** Parcours thématiques et avancement. */
export function useJourneys() {
  return useAppQuery({ queryKey: JOURNEYS_KEY, queryFn: fetchJourneys });
}

/** Stations fantômes et leur état (débloquée ou non). */
export function useGhostStations() {
  return useAppQuery({ queryKey: GHOST_STATIONS_KEY, queryFn: fetchGhostStations });
}
