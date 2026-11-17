import { useAppQuery } from '@/shared/lib';

import { fetchFavorites } from '../api';

export const FAVORITES_KEY = ['bonplans', 'favorites'] as const;

/** Les bons plans favoris de l'utilisateur. */
export function useFavorites() {
  return useAppQuery({
    queryKey: FAVORITES_KEY,
    queryFn: fetchFavorites,
  });
}
