import type { OfflineQuery } from '@/shared/lib';

import { fetchBonplanStations, fetchFavorites } from '../api';
import { BONPLAN_STATIONS_KEY } from './useBonplanStations';
import { FAVORITES_KEY } from './useFavorites';

/**
 * Ce que l'onglet Bons plans garde disponible sous terre sans avoir été ouvert : l'accueil et les
 * favoris. Les bons plans de chaque station (plusieurs Mo au total) ne le sont qu'une fois consultés.
 */
export const bonplansOfflineQueries: OfflineQuery[] = [
  { queryKey: BONPLAN_STATIONS_KEY, queryFn: fetchBonplanStations },
  { queryKey: FAVORITES_KEY, queryFn: fetchFavorites },
];
