import type { QueryClient } from '@tanstack/react-query';

import { fetchLineDetail, fetchNetwork, fetchPlatforms } from '../api';

// Clés identiques à celles des hooks (useLineDetail, usePlatforms, useNetwork) : ce qui est
// préchargé ici est exactement ce que les écrans liront ensuite.
const PLATFORMS_KEY = ['network', 'platforms'] as const;
const NETWORK_GEO_KEY = ['network', 'geo'] as const;
const lineDetailKey = (id: number) => ['network', 'line', id] as const;

/** Une donnée préchargée depuis moins longtemps que ça n'est pas retéléchargée. */
const FRESH_MS = 1000 * 60 * 60 * 24;

/**
 * Télécharge tout le réseau pour qu'il soit disponible sous terre : l'index des quais, le rail de
 * CHAQUE ligne (même jamais ouverte) et les tracés de la carte. Sans ça, seules les lignes déjà
 * consultées fonctionneraient hors ligne.
 *
 * - Une ligne après l'autre : pas de rafale de requêtes sur une connexion mobile.
 * - Ce qui est déjà à jour n'est pas retéléchargé : relancer coûte presque rien.
 * - Un échec n'arrête pas le reste ; on réessaiera au prochain passage.
 *
 * @param isCancelled interrogé entre deux téléchargements (réseau perdu, écran quitté)
 * @returns le nombre de lignes disponibles hors ligne après ce passage
 */
export async function prefetchNetwork(
  client: QueryClient,
  isCancelled: () => boolean = () => false,
): Promise<number> {
  const platforms = await client.fetchQuery({
    queryKey: PLATFORMS_KEY,
    queryFn: fetchPlatforms,
    staleTime: FRESH_MS,
  });
  const lineIds = [...new Set(platforms.map((p) => p.lineId))];

  let available = 0;
  for (const id of lineIds) {
    if (isCancelled()) return available;
    try {
      await client.fetchQuery({
        queryKey: lineDetailKey(id),
        queryFn: () => fetchLineDetail(id),
        staleTime: FRESH_MS,
      });
      available += 1;
    } catch {
      // Cette ligne sera retentée au prochain passage.
    }
  }

  if (!isCancelled()) {
    // Tracés + stations de la carte (le plus gros morceau, en dernier).
    await client
      .fetchQuery({ queryKey: NETWORK_GEO_KEY, queryFn: fetchNetwork, staleTime: FRESH_MS })
      .catch(() => undefined);
  }

  return available;
}
