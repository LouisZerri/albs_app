import { useMutation } from '@tanstack/react-query';

import { submitBonplan } from '../api';
import type { BonplanInput } from '../types';

/** Propose un bon plan pour une station (créé en attente de modération). */
export function useSubmitBonplan(stationId: number) {
  return useMutation({
    mutationFn: (input: BonplanInput) => submitBonplan(stationId, input),
  });
}
