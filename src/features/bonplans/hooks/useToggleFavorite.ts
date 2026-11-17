import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setBonplanFavorite } from '../api';
import type { Bonplan, StationBonplans } from '../types';
import { FAVORITES_KEY } from './useFavorites';
import { STATION_BONPLANS_PREFIX } from './useStationBonplans';

type Vars = { bonplanId: number; favorite: boolean };

/**
 * Ajoute/retire un favori. Mise à jour optimiste (l'étoile réagit tout de suite) des écrans de
 * station ET de la liste des favoris, annulée si le serveur refuse.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bonplanId, favorite }: Vars) => setBonplanFavorite(bonplanId, favorite),

    onMutate: async ({ bonplanId, favorite }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: STATION_BONPLANS_PREFIX }),
        queryClient.cancelQueries({ queryKey: FAVORITES_KEY }),
      ]);
      const stations = queryClient.getQueriesData<StationBonplans>({
        queryKey: STATION_BONPLANS_PREFIX,
      });
      const favorites = queryClient.getQueryData<Bonplan[]>(FAVORITES_KEY);

      queryClient.setQueriesData<StationBonplans>({ queryKey: STATION_BONPLANS_PREFIX }, (old) =>
        old
          ? {
              ...old,
              bonplans: old.bonplans.map((b) =>
                b.id === bonplanId ? { ...b, isFavorite: favorite } : b,
              ),
            }
          : old,
      );
      if (!favorite) {
        queryClient.setQueryData<Bonplan[]>(FAVORITES_KEY, (old) =>
          old?.filter((b) => b.id !== bonplanId),
        );
      }

      return { stations, favorites };
    },

    onError: (_err, _vars, context) => {
      context?.stations.forEach(([key, data]) => queryClient.setQueryData(key, data));
      queryClient.setQueryData(FAVORITES_KEY, context?.favorites);
    },

    // La liste des favoris se recharge (un ajout n'y figure pas encore).
    onSettled: () => queryClient.invalidateQueries({ queryKey: FAVORITES_KEY }),
  });
}
