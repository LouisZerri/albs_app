import { useQuery } from '@tanstack/react-query';

import { fetchBadges } from '../api';

export const BADGES_KEY = ['profile', 'badges'] as const;

/** Tous les badges de l'utilisateur (acquis + progression vers les suivants). */
export function useBadges() {
  return useQuery({
    queryKey: BADGES_KEY,
    queryFn: fetchBadges,
  });
}
