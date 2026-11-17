import { useMutation, type QueryClient } from '@tanstack/react-query';

import { OFFLINE_QUEUE_META, retryUntilSynced } from '@/shared/lib';

import { setBonplanFavorite } from '../api';
import type { Bonplan, StationBonplans } from '../types';
import { FAVORITES_KEY } from './useFavorites';
import { STATION_BONPLANS_PREFIX } from './useStationBonplans';

type Vars = { bonplanId: number; favorite: boolean };

const TOGGLE_FAVORITE_KEY = ['toggle-favorite'] as const;

/**
 * Déclare l'ajout/retrait d'un favori auprès du client de requêtes. Comme pour les cochages, tout
 * vit ICI et non dans le hook : un favori modifié hors ligne peut partir après un redémarrage de
 * l'app, quand plus aucun écran n'est là. À appeler une fois, au démarrage.
 */
export function registerToggleFavoriteMutation(client: QueryClient): void {
  client.setMutationDefaults(TOGGLE_FAVORITE_KEY, {
    mutationFn: ({ bonplanId, favorite }: Vars) => setBonplanFavorite(bonplanId, favorite),

    // Envoyés un par un, dans l'ordre des taps : l'état final est le bon.
    scope: { id: 'bonplan-favorites' },
    retry: retryUntilSynced,
    meta: OFFLINE_QUEUE_META,

    // L'étoile réagit tout de suite, sur les écrans de station ET dans la liste des favoris.
    onMutate: async ({ bonplanId, favorite }: Vars) => {
      await Promise.all([
        client.cancelQueries({ queryKey: STATION_BONPLANS_PREFIX }),
        client.cancelQueries({ queryKey: FAVORITES_KEY }),
      ]);

      // Le bon plan tel qu'affiché sur un écran de station (pour l'ajouter à la liste des favoris).
      const shown = client
        .getQueriesData<StationBonplans>({ queryKey: STATION_BONPLANS_PREFIX })
        .flatMap(([, data]) => data?.bonplans ?? [])
        .find((b) => b.id === bonplanId);

      client.setQueriesData<StationBonplans>({ queryKey: STATION_BONPLANS_PREFIX }, (old) =>
        old
          ? {
              ...old,
              bonplans: old.bonplans.map((b) =>
                b.id === bonplanId ? { ...b, isFavorite: favorite } : b,
              ),
            }
          : old,
      );
      client.setQueryData<Bonplan[]>(FAVORITES_KEY, (old) => {
        if (!old) return old;
        const others = old.filter((b) => b.id !== bonplanId);
        return favorite && shown ? [{ ...shown, isFavorite: true }, ...others] : others;
      });
    },

    // Refus définitif du serveur : on recharge la vérité (pas de retour à une copie d'avant, qui
    // effacerait les changements suivants encore en file).
    onError: () => client.invalidateQueries({ queryKey: STATION_BONPLANS_PREFIX }),

    onSettled: () => {
      // On ne resynchronise que lorsque plus aucun changement de favori n'est en vol.
      if (client.isMutating({ mutationKey: TOGGLE_FAVORITE_KEY }) === 1) {
        client.invalidateQueries({ queryKey: FAVORITES_KEY });
      }
    },
  });
}

/**
 * Ajoute/retire un favori. L'affichage change tout de suite ; l'envoi au serveur se fait dès que
 * possible, y compris après une coupure de réseau ou un redémarrage de l'app.
 */
export function useToggleFavorite() {
  return useMutation<void, Error, Vars>({ mutationKey: TOGGLE_FAVORITE_KEY });
}

/** Clé des changements de favoris (tests, comptage des envois en attente). */
export { TOGGLE_FAVORITE_KEY };
