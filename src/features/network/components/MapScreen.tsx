import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { useBadgeCelebration } from '@/features/badges';
import { colors } from '@/shared/theme';
import { Button, Text } from '@/shared/ui';

import {
  useMyProgress,
  useNetwork,
  useNetworkStats,
  useStationFeedback,
  useToggleStation,
} from '../hooks';
import { progressMap, stationState, type StationState } from '../lib/stationState';
import type { MapStation } from '../types';
import { MAP_SHEET_COLLAPSED, MapProgressSheet } from './MapProgressSheet';
import { MapSearch } from './MapSearch';
import { StationDot } from './StationDot';
import { StationSheet } from './StationSheet';

const PARIS = { latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.17, longitudeDelta: 0.17 };

const FLAGS: Record<StationState, { passed: boolean; stopped: boolean }> = {
  todo: { passed: false, stopped: false },
  passed: { passed: true, stopped: false },
  visited: { passed: true, stopped: true },
};

/** Onglet Réseau, vue Carte : réseau réel + stations colorées + cochage (3 états) + recherche. */
export function MapScreen() {
  const router = useRouter();
  const network = useNetwork();
  const stats = useNetworkStats();
  const progress = useMyProgress();
  const toggle = useToggleStation();
  const feedback = useStationFeedback();
  const { celebrate } = useBadgeCelebration();
  const mapRef = useRef<MapView>(null);

  const [selected, setSelected] = useState<MapStation | null>(null);
  const [latDelta, setLatDelta] = useState(PARIS.latitudeDelta);
  const [lineId, setLineId] = useState<number | null>(null);
  const [remainingOnly, setRemainingOnly] = useState(false);
  const [areaHeight, setAreaHeight] = useState(0);

  const map = useMemo(() => progressMap(progress.data ?? []), [progress.data]);
  // Positions déjà recalées sur le tracé par l'API (StationSnapper) : on les affiche telles quelles.
  const stations = network.data?.stations ?? [];

  if (network.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (network.isError || !network.data) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text variant="muted" className="text-center">
          Impossible de charger la carte.
        </Text>
        <Button label="Réessayer" variant="secondary" onPress={() => network.refetch()} />
      </View>
    );
  }

  const selectedState = selected ? stationState(map.get(selected.id)) : 'todo';
  // « Ce qu'il me reste » : on masque les stations déjà visitées.
  const shownStations = remainingOnly
    ? stations.filter((s) => stationState(map.get(s.id)) !== 'visited')
    : stations;

  // Tap sur la carte → sélectionne la station la plus proche (seuil = 6% du zoom visible).
  const onMapPress = (lat: number, lng: number) => {
    let best: MapStation | null = null;
    let bestDist = Infinity;
    for (const s of stations) {
      const dLat = s.lat - lat;
      const dLng = (s.lng - lng) * 0.66;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
    setSelected(best && bestDist < latDelta * 0.06 ? best : null);
  };

  const centerOn = (station: MapStation) => {
    Keyboard.dismiss();
    setSelected(station);
    mapRef.current?.animateToRegion(
      { latitude: station.lat, longitude: station.lng, latitudeDelta: 0.012, longitudeDelta: 0.012 },
      450,
    );
  };

  const setState = (station: MapStation, target: StationState) => {
    if (target === stationState(map.get(station.id))) return;
    feedback(target);
    toggle.mutate(
      { stationId: station.id, ...FLAGS[target] },
      { onSuccess: (res) => celebrate(res.newBadges) },
    );
  };

  return (
    <View className="flex-1 overflow-hidden" onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={PARIS}
        // Le panneau du bas masque une partie de la carte : le centrage en tient compte.
        mapPadding={{ top: 0, right: 0, bottom: MAP_SHEET_COLLAPSED, left: 0 }}
        showsPointsOfInterests={false}
        showsCompass={false}
        toolbarEnabled={false}
        onRegionChangeComplete={(r) => setLatDelta(r.latitudeDelta)}
        onPress={(e) => onMapPress(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}>
        {network.data.lines.flatMap((line) => {
          const dim = lineId !== null && line.id !== lineId;
          const highlighted = line.id === lineId;
          return (line.geometry ?? []).map((segment, i) => (
            <Polyline
              key={`${line.id}-${i}`}
              coordinates={segment.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))}
              strokeColor={dim ? '#C7CDD6' : line.color}
              strokeWidth={highlighted ? 5 : dim ? 2 : 3}
              zIndex={highlighted ? 3 : 1}
            />
          ));
        })}

        {shownStations.map((s) => {
          const st = stationState(map.get(s.id));
          const isSel = selected?.id === s.id;
          return (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.lat, longitude: s.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={isSel}>
              <StationDot state={st} selected={isSel} />
            </Marker>
          );
        })}
      </MapView>

      <MapSearch stations={stations} onSelect={centerOn} />

      {selected ? (
        <StationSheet
          station={selected}
          state={selectedState}
          onSetState={(target) => setState(selected, target)}
          onOpenBonplans={() => router.push(`/bonplans/${selected.id}`)}
        />
      ) : areaHeight > 0 ? (
        <MapProgressSheet
          areaHeight={areaHeight}
          stats={stats.data}
          lines={network.data.lines}
          lineId={lineId}
          onToggleLine={(id) => setLineId((prev) => (prev === id ? null : id))}
          remainingOnly={remainingOnly}
          onRemainingOnlyChange={setRemainingOnly}
        />
      ) : null}
    </View>
  );
}
