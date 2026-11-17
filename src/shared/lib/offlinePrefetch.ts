import type { QueryClient, QueryKey } from '@tanstack/react-query';

/** Une donnée préchargée depuis moins longtemps que ça n'est pas retéléchargée. */
export const PREFETCH_FRESH_MS = 1000 * 60 * 60 * 24;

/** Une requête qu'une fonctionnalité veut disponible sous terre (mêmes clé et fonction que son hook). */
export type OfflineQuery = { queryKey: QueryKey; queryFn: () => Promise<unknown> };

/**
 * Un téléchargement d'arrière-plan pour le hors-ligne. `isCancelled` est interrogé entre deux
 * requêtes (réseau perdu, écran quitté) ; une tâche ne doit jamais lever d'erreur bloquante.
 */
export type OfflineTask = (client: QueryClient, isCancelled: () => boolean) => Promise<unknown>;

/**
 * Précharge une liste de requêtes, l'une après l'autre. Ce qui est déjà à jour n'est pas
 * retéléchargé ; un échec n'arrête pas les suivantes (il sera retenté au prochain passage).
 */
export function prefetchQueries(queries: readonly OfflineQuery[]): OfflineTask {
  return async (client, isCancelled) => {
    for (const query of queries) {
      if (isCancelled()) return;
      // `prefetchQuery` ne lève jamais : une erreur reste dans l'état de la requête.
      await client.prefetchQuery({ ...query, staleTime: PREFETCH_FRESH_MS });
    }
  };
}
