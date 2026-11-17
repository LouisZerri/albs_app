import { useQuery } from '@tanstack/react-query';

import { fetchHistory } from '../api';

export const HISTORY_KEY = ['profile', 'history'] as const;

/** Stations visitées, datées, plus récentes d'abord. (Rafraîchi après chaque cochage : clé « profile ».) */
export function useHistory() {
  return useQuery({
    queryKey: HISTORY_KEY,
    queryFn: fetchHistory,
  });
}
