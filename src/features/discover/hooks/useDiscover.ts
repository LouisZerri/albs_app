import { useQuery } from '@tanstack/react-query';

import { fetchGhostStations, fetchJourneys } from '../api';

// Clés sous « discover » : rafraîchies après chaque cochage (cf. useToggleStation).
export const JOURNEYS_KEY = ['discover', 'journeys'] as const;
export const GHOST_STATIONS_KEY = ['discover', 'ghost-stations'] as const;

/** Parcours thématiques et avancement. */
export function useJourneys() {
  return useQuery({ queryKey: JOURNEYS_KEY, queryFn: fetchJourneys });
}

/** Stations fantômes et leur état (débloquée ou non). */
export function useGhostStations() {
  return useQuery({ queryKey: GHOST_STATIONS_KEY, queryFn: fetchGhostStations });
}
