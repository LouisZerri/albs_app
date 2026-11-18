import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { ErrorState, Screen, Text } from '@/shared/ui';

import {
  PROGRESS_KEY,
  useLineDetail,
  useMyProgress,
  useScrollToStation,
  useRailToggle,
  useTrip,
} from '../hooks';
import { branchOfStation, buildRail, railIndexOf, type RailItem } from '../lib/railModel';
import { progressMap, stationState } from '../lib/stationState';
import type { Station } from '../types';
import { ForkRow } from './ForkRow';
import { LineHeader } from './LineHeader';
import { LoopCard } from './LoopCard';
import { StationRow } from './StationRow';
import { TRIP_BAR_SPACE, TripBar } from './TripBar';

/** L'aide « Touche une station… » n'est affichée que tant que l'utilisateur a coché moins de stations que ça. */
const HINT_UNTIL_STATIONS = 5;

type Props = {
  id: number;
  /** Nom d'une station à atteindre à l'ouverture (venue de la recherche) : on y défile et on la surligne. */
  focusStation?: string;
};

/** Écran « rail » d'une ligne : en-tête + liste tappable des stations + célébrations (badges, ligne terminée). */
export function LineRailScreen({ id, focusStation }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');
  const router = useRouter();
  const queryClient = useQueryClient();
  const lineQuery = useLineDetail(id);
  const progressQuery = useMyProgress();
  const listRef = useRef<FlatList<RailItem>>(null);
  const [branch, setBranch] = useState<string | null>(null);

  const map = useMemo(() => progressMap(progressQuery.data ?? []), [progressQuery.data]);
  const line = lineQuery.data;
  // Tant que l'utilisateur n'a pas choisi de branche, on montre celle de la station recherchée.
  const rail = useMemo(
    () =>
      line
        ? buildRail(line, branch ?? (focusStation ? branchOfStation(line, focusStation) : null))
        : null,
    [line, branch, focusStation],
  );
  const focusIndex = rail && focusStation ? railIndexOf(rail.items, rail.loop, focusStation) : -1;
  const scrolling = useScrollToStation(listRef, focusIndex);
  const trip = useTrip(line, rail?.realStations ?? []);
  const onToggle = useRailToggle(line?.number, rail?.realStations ?? []);

  // À chaque ouverture d'une ligne : resynchronise la progression (propagation hub cross-lignes).
  useFocusEffect(
    useCallback(() => {
      void queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
    }, [queryClient]),
  );

  if (lineQuery.isPending || progressQuery.isPending) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} />
        </View>
      </Screen>
    );
  }

  if (lineQuery.isError || !line || !rail) {
    return (
      <Screen>
        <ErrorState
          error={lineQuery.error}
          message={t('rail.loadError')}
          onRetry={() => lineQuery.refetch()}
        />
      </Screen>
    );
  }

  const total = rail.realStations.length;
  const visited = rail.realStations.filter((s) => map.get(s.id)?.stopped).length;

  const openBonplans = (station: Station) => router.push(`/bonplans/${station.id}`);

  // Pendant la saisie d'un trajet, un tap choisit le départ puis l'arrivée au lieu de cocher.
  const onPress = (station: Station) => (trip.active ? trip.pick(station) : onToggle(station));
  const isHighlighted = (station: Station) =>
    trip.highlighted.has(station.id) || (!trip.active && station.name === focusStation);

  return (
    <View className="flex-1 bg-bg">
      <LineHeader
        line={line}
        visited={visited}
        total={total}
        percent={total > 0 ? Math.round((visited / total) * 100) : 0}
        onBack={() => router.back()}
        onAddTrip={() => trip.begin()}
      />

      {/* Aide de prise en main : disparaît une fois le geste acquis (quelques stations cochées). */}
      {map.size < HINT_UNTIL_STATIONS && !trip.active ? (
        <View className="px-5 py-2.5">
          <Text variant="muted">{t('rail.hint')}</Text>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={rail.items}
        keyExtractor={(item, index) =>
          item.type === 'loop' ? `loop-${index}` : String(item.station.id)
        }
        // Une ligne compte au plus quelques dizaines de stations : on les rend toutes d'emblée,
        // sinon la station visée n'existe pas encore à l'écran et le défilement ne peut pas l'atteindre.
        initialNumToRender={rail.items.length}
        onContentSizeChange={scrolling.onContentSizeChange}
        onScrollToIndexFailed={scrolling.onScrollToIndexFailed}
        renderItem={({ item, index }) => {
          if (item.type === 'loop') {
            return rail.loop ? (
              <LoopCard
                loop={rail.loop}
                color={line.color}
                textColor={line.textColor}
                map={map}
                onToggle={onPress}
                onLongPress={trip.begin}
                onOpenBonplans={openBonplans}
                isHighlighted={isHighlighted}
              />
            ) : null;
          }
          const common = {
            station: item.station,
            state: stationState(map.get(item.station.id)),
            color: line.color,
            textColor: line.textColor,
            isFirst: index === 0,
            isLast: index === rail.items.length - 1,
            onPress: () => onPress(item.station),
            onLongPress: () => trip.begin(item.station),
            highlighted: isHighlighted(item.station),
            onOpenBonplans: () => openBonplans(item.station),
          };
          return item.type === 'fork' ? (
            <ForkRow
              {...common}
              branches={rail.branches}
              selected={rail.selectedBranch}
              onSelect={setBranch}
              branchesBelow={rail.branchesBelow}
            />
          ) : (
            <StationRow {...common} hideTop={item.hideTop} hideBottom={item.hideBottom} />
          );
        }}
        contentContainerClassName="pb-10"
        // La barre du trajet recouvre le bas : on laisse de quoi faire défiler les dernières stations.
        contentContainerStyle={
          trip.active || trip.canUndo ? { paddingBottom: TRIP_BAR_SPACE } : undefined
        }
        showsVerticalScrollIndicator={false}
      />

      <TripBar trip={trip} />
    </View>
  );
}
