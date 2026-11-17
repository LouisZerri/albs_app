import { useMemo } from 'react';

import { useMyProgress } from '@/features/network/hooks';

/**
 * Ids des quais où l'utilisateur est descendu. La règle du hub coche tous les quais de même nom,
 * donc le quai représentatif d'une station regroupée y figure dès qu'elle est visitée.
 */
export function useVisitedStationIds(): ReadonlySet<number> {
  const { data } = useMyProgress();

  return useMemo(
    () => new Set((data ?? []).filter((e) => e.stopped).map((e) => e.stationId)),
    [data],
  );
}
