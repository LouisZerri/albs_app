import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setStationProgress } from '../api';
import type { ProgressEntry } from '../types';
import { NETWORK_STATS_KEY } from './useNetworkStats';
import { PROGRESS_KEY } from './useMyProgress';

type Vars = { stationId: number; passed: boolean; stopped: boolean };

const TOGGLE_KEY = ['toggle-station'] as const;

/**
 * Coche/décoche une station. Met à jour la progression de façon optimiste
 * (feedback immédiat), puis resynchronise (le serveur propage aux quais du hub).
 */
export function useToggleStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: TOGGLE_KEY,
    mutationFn: ({ stationId, passed, stopped }: Vars) =>
      setStationProgress(stationId, { passed, stopped }),

    onMutate: async ({ stationId, passed, stopped }) => {
      await queryClient.cancelQueries({ queryKey: PROGRESS_KEY });
      const previous = queryClient.getQueryData<ProgressEntry[]>(PROGRESS_KEY);

      queryClient.setQueryData<ProgressEntry[]>(PROGRESS_KEY, (old = []) => {
        const others = old.filter((e) => e.stationId !== stationId);
        return passed || stopped ? [...others, { stationId, passed, stopped }] : others;
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(PROGRESS_KEY, context.previous);
      }
    },

    onSettled: () => {
      // Ne resynchronise que lorsque plus AUCUN tap n'est en vol (isMutating === 1 = celui-ci,
      // le dernier). Sinon un refetch précoce écraserait les MAJ optimistes des taps rapides.
      if (queryClient.isMutating({ mutationKey: TOGGLE_KEY }) === 1) {
        queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
        queryClient.invalidateQueries({ queryKey: NETWORK_STATS_KEY });
        // Un cochage peut débloquer un badge / faire progresser sa jauge.
        // Match par préfixe (= BADGES_KEY ['profile','badges']) sans coupler network → profile.
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        // Parcours et stations fantômes dépendent des stations visitées (même principe, clé « discover »).
        queryClient.invalidateQueries({ queryKey: ['discover'] });
      }
    },
  });
}
