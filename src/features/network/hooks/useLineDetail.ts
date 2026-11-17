import { useAppQuery } from '@/shared/lib';

import { fetchLineDetail } from '../api';

export const lineDetailKey = (id: number) => ['network', 'line', id] as const;

/** Détail d'une ligne (stations + correspondances). */
export function useLineDetail(id: number) {
  return useAppQuery({
    queryKey: lineDetailKey(id),
    queryFn: () => fetchLineDetail(id),
  });
}
