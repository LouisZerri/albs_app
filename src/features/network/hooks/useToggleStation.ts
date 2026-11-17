import { useMutation, type QueryClient } from '@tanstack/react-query';

import { OFFLINE_QUEUE_META, retryUntilSynced } from '@/shared/lib';

import { setStationProgress, type SetProgressResponse } from '../api';
import { applyToggle } from '../lib/localProgress';
import type { Platform, ProgressEntry } from '../types';
import { NETWORK_STATS_KEY } from './useNetworkStats';
import { PROGRESS_KEY } from './useMyProgress';
import { PLATFORMS_KEY } from './usePlatforms';

/** Ce que l'écran demande : l'état voulu pour une station. */
type ToggleInput = { stationId: number; passed: boolean; stopped: boolean };
/** Ce qui part au serveur : la même chose, datée du moment réel du tap (il peut partir bien plus tard). */
type ToggleVars = ToggleInput & { at: string };

const TOGGLE_KEY = ['toggle-station'] as const;

/**
 * Déclare le cochage d'une station auprès du client de requêtes. Tout son comportement vit ICI
 * (et non dans le hook) : un cochage fait hors ligne peut être envoyé après un redémarrage de
 * l'app, quand plus aucun écran n'est là pour dire quoi faire. À appeler une fois, au démarrage.
 */
export function registerToggleStationMutation(client: QueryClient): void {
  client.setMutationDefaults(TOGGLE_KEY, {
    mutationFn: ({ stationId, passed, stopped, at }: ToggleVars) =>
      setStationProgress(stationId, { passed, stopped, at }),

    // Les cochages s'envoient un par un, dans l'ordre des taps : l'état final est le bon.
    scope: { id: 'station-progress' },
    retry: retryUntilSynced,
    meta: OFFLINE_QUEUE_META,

    // Affichage immédiat, sans attendre le serveur (ni même le réseau).
    onMutate: async ({ stationId, passed, stopped }: ToggleVars) => {
      await client.cancelQueries({ queryKey: PROGRESS_KEY });
      // Mêmes règles que le serveur, appliquées ici : « descendu » coche aussi les autres quais
      // de la station (correspondances), sans attendre le réseau.
      const platforms = client.getQueryData<Platform[]>(PLATFORMS_KEY) ?? [];
      client.setQueryData<ProgressEntry[]>(PROGRESS_KEY, (old = []) =>
        applyToggle(old, platforms, { stationId, passed, stopped }),
      );
    },

    // Refus définitif du serveur : on recharge la vérité plutôt que de revenir à une copie
    // d'avant, qui effacerait les cochages suivants encore en attente.
    onError: () => client.invalidateQueries({ queryKey: PROGRESS_KEY }),

    onSettled: () => {
      // Ne resynchronise que lorsque plus AUCUN cochage n'est en vol (isMutating === 1 = celui-ci,
      // le dernier). Sinon un refetch précoce écraserait l'affichage des cochages encore en file.
      if (client.isMutating({ mutationKey: TOGGLE_KEY }) === 1) {
        client.invalidateQueries({ queryKey: PROGRESS_KEY });
        client.invalidateQueries({ queryKey: NETWORK_STATS_KEY });
        // Un cochage peut débloquer un badge / faire progresser sa jauge.
        // Match par préfixe (= BADGES_KEY ['profile','badges']) sans coupler network → profile.
        client.invalidateQueries({ queryKey: ['profile'] });
        // Parcours et stations fantômes dépendent des stations visitées (même principe, clé « discover »).
        client.invalidateQueries({ queryKey: ['discover'] });
      }
    },
  });
}

/**
 * Coche/décoche une station. L'affichage change tout de suite ; l'envoi au serveur se fait dès
 * que possible, y compris après une coupure de réseau ou un redémarrage de l'app.
 */
export function useToggleStation() {
  const mutation = useMutation<SetProgressResponse, Error, ToggleVars>({ mutationKey: TOGGLE_KEY });

  return {
    ...mutation,
    /** `at` = maintenant : c'est l'heure du tap qui fait foi, pas celle de l'envoi. */
    mutate: (input: ToggleInput, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate({ ...input, at: new Date().toISOString() }, options),
  };
}

/** Clé des cochages : sert à compter ceux qui attendent encore d'être envoyés. */
export const TOGGLE_STATION_KEY = TOGGLE_KEY;
