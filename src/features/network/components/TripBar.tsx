import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/i18n';
import { Button, Text } from '@/shared/ui';

import type { Trip } from '../hooks/useTrip';

/**
 * Barre du « trajet en un geste », posée en bas du rail : elle guide la saisie (départ, arrivée),
 * demande de valider, puis laisse quelques secondes pour annuler. Rien quand aucun trajet n'est en jeu.
 */
export function TripBar({ trip }: { trip: Trip }) {
  const { t } = useTranslation(['network', 'common']);
  const insets = useSafeAreaInsets();

  if (!trip.active && !trip.canUndo) return null;

  const ready = trip.active && trip.start !== null && trip.end !== null;
  const message = !trip.active
    ? t('trip.added')
    : ready
      ? t('trip.summary', { from: trip.start?.name, to: trip.end?.name, count: trip.length })
      : trip.start
        ? t('trip.pickEnd', { from: trip.start.name })
        : t('trip.pickStart');

  return (
    <View
      accessibilityRole="alert"
      className="absolute inset-x-0 bottom-0 gap-3 border-t border-hair bg-surface px-5 pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <Text variant={ready ? 'subtitle' : 'body'} numberOfLines={2}>
        {message}
      </Text>
      <View className="flex-row gap-3">
        {trip.active ? (
          <>
            <View className="flex-1">
              <Button
                label={t('common:actions.cancel')}
                variant="secondary"
                onPress={trip.cancel}
              />
            </View>
            {ready ? (
              <View className="flex-1">
                <Button label={t('trip.confirm')} onPress={trip.confirm} />
              </View>
            ) : null}
          </>
        ) : (
          <View className="flex-1">
            <Button label={t('trip.undo')} variant="secondary" onPress={trip.undoLast} />
          </View>
        )}
      </View>
    </View>
  );
}

/** Hauteur à réserver en bas de la liste pour que la barre ne masque pas les dernières stations. */
export const TRIP_BAR_SPACE = 150;
