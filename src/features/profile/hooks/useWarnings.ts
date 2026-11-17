import { useMutation } from '@tanstack/react-query';

import { queryClient, useAppQuery } from '@/shared/lib';

import { acknowledgeWarning, fetchWarnings } from '../api';

export const WARNINGS_KEY = ['profile', 'warnings'] as const;

/** Avertissements de modération du compte courant. */
export function useWarnings() {
  return useAppQuery({
    queryKey: WARNINGS_KEY,
    queryFn: fetchWarnings,
  });
}

/** Accuse réception d'un avertissement, puis rafraîchit la liste. */
export function useAcknowledgeWarning() {
  return useMutation({
    mutationFn: (id: number) => acknowledgeWarning(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WARNINGS_KEY }),
  });
}
