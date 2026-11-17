import { useTranslation } from '@/i18n';
import { useToast } from '@/shared/ui';

import { openWalkingDirections } from '../lib/directions';
import { coordinateOf } from '../lib/distance';
import type { Bonplan } from '../types';
import { useToggleFavorite } from './useToggleFavorite';

/** Actions d'une carte de bon plan (favori, itinéraire) avec leurs messages de retour. */
export function useBonplanActions() {
  const toast = useToast();
  const { t } = useTranslation('bonplans');
  const { mutate } = useToggleFavorite();

  const toggleFavorite = (bonplan: Bonplan) => {
    const favorite = !bonplan.isFavorite;
    // Confirmation immédiate, comme l'étoile : hors ligne, l'envoi peut n'arriver que bien plus tard.
    if (favorite) toast.show(t('toasts.favoriteAdded'), 'success');
    else toast.show(t('toasts.favoriteRemoved'), 'info');

    mutate(
      { bonplanId: bonplan.id, favorite },
      { onError: () => toast.show(t('toasts.favoriteError'), 'error') },
    );
  };

  const openDirections = (bonplan: Bonplan) => {
    const coordinate = coordinateOf(bonplan);
    if (coordinate) {
      openWalkingDirections(coordinate).catch(() =>
        toast.show(t('toasts.directionsError'), 'error'),
      );
    }
  };

  return { toggleFavorite, openDirections };
}
