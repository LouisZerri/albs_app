import { useAppQuery } from '@/shared/lib';

import { fetchBadges } from '../api';

export const BADGES_KEY = ['profile', 'badges'] as const;

/** Tous les badges de l'utilisateur (acquis + progression vers les suivants). */
export function useBadges() {
  return useAppQuery({
    queryKey: BADGES_KEY,
    queryFn: fetchBadges,
  });
}
