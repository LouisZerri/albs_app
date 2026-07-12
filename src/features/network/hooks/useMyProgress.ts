import { useQuery } from '@tanstack/react-query';

import { fetchMyProgress } from '../api';

export const PROGRESS_KEY = ['network', 'progress'] as const;

/** Progression complète de l'utilisateur (une entrée par station touchée). */
export function useMyProgress() {
  return useQuery({
    queryKey: PROGRESS_KEY,
    queryFn: fetchMyProgress,
  });
}
