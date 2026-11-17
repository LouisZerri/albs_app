import type { OfflineQuery } from '@/shared/lib';

import { fetchBadges, fetchHistory } from '../api';
import { BADGES_KEY } from './useBadges';
import { HISTORY_KEY } from './useHistory';

/** Le Profil (badges, historique), disponible sous terre sans avoir été ouvert. */
export const profileOfflineQueries: OfflineQuery[] = [
  { queryKey: BADGES_KEY, queryFn: fetchBadges },
  { queryKey: HISTORY_KEY, queryFn: fetchHistory },
];
