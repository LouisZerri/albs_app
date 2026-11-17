import { useToast } from '@/shared/ui';

import { openWalkingDirections } from '../lib/directions';
import { coordinateOf } from '../lib/distance';
import type { Bonplan } from '../types';
import { useToggleFavorite } from './useToggleFavorite';

/** Actions d'une carte de bon plan (favori, itinéraire) avec leurs messages de retour. */
export function useBonplanActions() {
  const toast = useToast();
  const { mutate } = useToggleFavorite();

  const toggleFavorite = (bonplan: Bonplan) => {
    const favorite = !bonplan.isFavorite;
    mutate(
      { bonplanId: bonplan.id, favorite },
      {
        onSuccess: () =>
          favorite
            ? toast.show('Ajouté à tes favoris', 'success')
            : toast.show('Retiré de tes favoris', 'info'),
        onError: () => toast.show('Impossible de modifier ce favori.', 'error'),
      },
    );
  };

  const openDirections = (bonplan: Bonplan) => {
    const coordinate = coordinateOf(bonplan);
    if (coordinate) {
      openWalkingDirections(coordinate).catch(() =>
        toast.show("Impossible d'ouvrir l'itinéraire.", 'error'),
      );
    }
  };

  return { toggleFavorite, openDirections };
}
