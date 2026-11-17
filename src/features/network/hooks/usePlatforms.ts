import { useQuery } from '@tanstack/react-query';

import { fetchPlatforms } from '../api';

export const PLATFORMS_KEY = ['network', 'platforms'] as const;

/**
 * Index de tous les quais (id, nom, ligne). Quasi immuable : gardé une journée, et enregistré sur
 * le téléphone. C'est lui qui permet d'appliquer la règle des correspondances et de recalculer les
 * compteurs sans le serveur.
 */
export function usePlatforms() {
  return useQuery({
    queryKey: PLATFORMS_KEY,
    queryFn: fetchPlatforms,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
