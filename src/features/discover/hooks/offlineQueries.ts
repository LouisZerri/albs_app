import type { OfflineQuery } from '@/shared/lib';

import { fetchGhostStations, fetchJourneys } from '../api';
import { GHOST_STATIONS_KEY, JOURNEYS_KEY } from './useDiscover';

/** L'onglet Découvrir, disponible sous terre sans avoir été ouvert. */
export const discoverOfflineQueries: OfflineQuery[] = [
  { queryKey: JOURNEYS_KEY, queryFn: fetchJourneys },
  { queryKey: GHOST_STATIONS_KEY, queryFn: fetchGhostStations },
];
