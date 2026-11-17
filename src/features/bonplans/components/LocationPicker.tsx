import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useTranslation } from '@/i18n';
import { useThemeColors, useThemeMode } from '@/shared/theme';
import { MapMarkerBox, Text, TextLink } from '@/shared/ui';

import type { LatLng } from '../lib/distance';

type Props = {
  /** Position de la station : centre de la carte. */
  center: LatLng;
  value: LatLng | null;
  onChange: (value: LatLng | null) => void;
};

/** Choix de l'emplacement d'un lieu : on touche la carte pour poser (ou déplacer) l'épingle. UI pure. */
export function LocationPicker({ center, value, onChange }: Props) {
  const { mode } = useThemeMode();
  const colors = useThemeColors();
  const { t } = useTranslation('bonplans');

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-between">
        <Text variant="label">{t('form.locationLabel')}</Text>
        {value ? <TextLink label={t('form.removePin')} onPress={() => onChange(null)} /> : null}
      </View>

      <View className="h-48 overflow-hidden rounded-card border border-hair">
        <MapView
          // Fond de carte assorti au thème de l'app (iOS).
          userInterfaceStyle={mode}
          style={{ flex: 1 }}
          initialRegion={{ ...center, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
          showsCompass={false}
          toolbarEnabled={false}
          onPress={(e) => onChange(e.nativeEvent.coordinate)}
        >
          <Marker coordinate={center} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <MapMarkerBox size={16}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.ink,
                  borderWidth: 3,
                  borderColor: colors.white,
                }}
              />
            </MapMarkerBox>
          </Marker>
          {value ? <Marker coordinate={value} pinColor={colors.accent} /> : null}
        </MapView>
      </View>

      <Text variant="muted">{value ? t('form.pinPlaced') : t('form.pinHint')}</Text>
    </View>
  );
}
