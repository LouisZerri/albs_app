import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useThemeColors, useThemeMode } from '@/shared/theme';

import { coordinateOf, regionAround, type LatLng, type NearbyBonplan } from '../lib/distance';

type Props = {
  /** Position de la station (centre de la carte). */
  station: LatLng;
  stationColor: string;
  bonplans: NearbyBonplan[];
  selectedId: number | null;
  /** Hauteur masquée en bas (panneau par-dessus la carte) : le centrage en tient compte. */
  bottomInset: number;
  onSelect: (bonplanId: number) => void;
};

/** Carte d'une station et de ses bons plans. Se recentre sur le bon plan sélectionné. UI pure. */
export function BonplanMap({
  station,
  stationColor,
  bonplans,
  selectedId,
  bottomInset,
  onSelect,
}: Props) {
  const { mode } = useThemeMode();
  const colors = useThemeColors();
  const mapRef = useRef<MapView>(null);
  const spots = bonplans.flatMap((b) => {
    const coordinate = coordinateOf(b);
    return coordinate ? [{ bonplan: b, coordinate }] : [];
  });

  const selected = spots.find((s) => s.bonplan.id === selectedId)?.coordinate;
  const selectedLat = selected?.latitude;
  const selectedLng = selected?.longitude;
  useEffect(() => {
    if (selectedLat !== undefined && selectedLng !== undefined) {
      mapRef.current?.animateToRegion(
        {
          latitude: selectedLat,
          longitude: selectedLng,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        },
        350,
      );
    }
  }, [selectedLat, selectedLng]);

  return (
    <MapView
      // Fond de carte assorti au thème de l'app (iOS).
      userInterfaceStyle={mode}
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={regionAround([station, ...spots.map((s) => s.coordinate)])}
      mapPadding={{ top: 0, right: 0, bottom: bottomInset, left: 0 }}
      showsPointsOfInterests={false}
      showsCompass={false}
      toolbarEnabled={false}
    >
      <Marker coordinate={station} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: stationColor,
            borderWidth: 3,
            borderColor: colors.white,
          }}
        />
      </Marker>

      {spots.map(({ bonplan, coordinate }) => {
        const isSelected = bonplan.id === selectedId;
        const size = isSelected ? 38 : 30;
        return (
          <Marker
            key={bonplan.id}
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={isSelected ? 2 : 1}
            tracksViewChanges={isSelected}
            onPress={() => onSelect(bonplan.id)}
          >
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.surface,
                borderWidth: isSelected ? 2.5 : 1,
                borderColor: isSelected ? colors.accent : colors.hair,
              }}
            >
              <Text allowFontScaling={false} style={{ fontSize: isSelected ? 19 : 15 }}>
                {bonplan.categoryIcon}
              </Text>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
