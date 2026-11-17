import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useBadgeCelebration } from '@/features/badges';
import { colors } from '@/shared/theme';
import { ErrorState, Screen, Text } from '@/shared/ui';

import { PROGRESS_KEY, useLineDetail, useMyProgress, useStationFeedback, useToggleStation } from '../hooks';
import { branchOfStation, buildRail, completesLine, railIndexOf, type RailItem } from '../lib/railModel';
import { nextState, progressMap, STATE_FLAGS, stationState } from '../lib/stationState';
import type { ProgressEntry, Station } from '../types';
import { ForkRow } from './ForkRow';
import { LineHeader } from './LineHeader';
import { LoopCard } from './LoopCard';
import { StationRow } from './StationRow';

/** L'aide « Touche une station… » n'est affichée que tant que l'utilisateur a coché moins de stations que ça. */
const HINT_UNTIL_STATIONS = 5;

type Props = {
  id: number;
  /** Nom d'une station à atteindre à l'ouverture (venue de la recherche) : on y défile et on la surligne. */
  focusStation?: string;
};

/** Écran « rail » d'une ligne : en-tête + liste tappable des stations + célébrations (badges, ligne terminée). */
export function LineRailScreen({ id, focusStation }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { celebrate } = useBadgeCelebration();
  const lineQuery = useLineDetail(id);
  const progressQuery = useMyProgress();
  const toggle = useToggleStation();
  const feedback = useStationFeedback();
  const listRef = useRef<FlatList<RailItem>>(null);
  const focused = useRef(false);
  const [branch, setBranch] = useState<string | null>(null);

  const map = useMemo(() => progressMap(progressQuery.data ?? []), [progressQuery.data]);

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

  if (lineQuery.isError || !lineQuery.data) {
    return (
      <Screen>
        <ErrorState
          error={lineQuery.error}
          message="Impossible de charger la ligne."
          onRetry={() => lineQuery.refetch()}
        />
      </Screen>
    );
  }

  const line = lineQuery.data;
  // Tant que l'utilisateur n'a pas choisi de branche, on montre celle de la station recherchée.
  const rail = buildRail(line, branch ?? (focusStation ? branchOfStation(line, focusStation) : null));
  const focusIndex = focusStation ? railIndexOf(rail.items, rail.loop, focusStation) : -1;

  const total = rail.realStations.length;
  const visited = rail.realStations.filter((s) => map.get(s.id)?.stopped).length;

  const onToggle = (station: Station) => {
    // Lecture du cache le plus frais (et pas du `map` mémoïsé) → cycle fiable en rafale.
    const entries = queryClient.getQueryData<ProgressEntry[]>(PROGRESS_KEY) ?? [];
    const next = nextState(stationState(entries.find((e) => e.stationId === station.id)));

    feedback(next); // son + haptique immédiats

    // Dernière station de la ligne : on fête la ligne terminée, sans attendre le serveur.
    if (next === 'visited' && completesLine(rail.realStations, entries, station.id)) {
      celebrate([{ name: `Ligne ${line.number}`, icon: '🎉', label: 'Ligne terminée' }]);
    }

    toggle.mutate(
      { stationId: station.id, ...STATE_FLAGS[next] },
      { onSuccess: (res) => celebrate(res.newBadges) },
    );
  };

  const openBonplans = (station: Station) => router.push(`/bonplans/${station.id}`);

  // Une seule fois, quand la liste est prête : on amène la station recherchée dans le tiers haut.
  const scrollToFocus = () => {
    if (focused.current || focusIndex < 0) return;
    focused.current = true;
    listRef.current?.scrollToIndex({ index: focusIndex, viewPosition: 0.3, animated: false });
  };

  return (
    <View className="flex-1 bg-bg">
      <LineHeader
        line={line}
        visited={visited}
        total={total}
        percent={total > 0 ? Math.round((visited / total) * 100) : 0}
        onBack={() => router.back()}
      />

      {/* Aide de prise en main : disparaît une fois le geste acquis (quelques stations cochées). */}
      {map.size < HINT_UNTIL_STATIONS ? (
        <View className="px-5 py-2.5">
          <Text variant="muted">Touche une station : passé → descendu → à faire 👆</Text>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={rail.items}
        keyExtractor={(item, index) => (item.type === 'loop' ? `loop-${index}` : String(item.station.id))}
        onContentSizeChange={scrollToFocus}
        // Lignes de hauteur variable (fourche, boucle) : cible pas encore mesurée → position estimée.
        onScrollToIndexFailed={({ index, averageItemLength }) =>
          listRef.current?.scrollToOffset({ offset: index * averageItemLength, animated: false })
        }
        renderItem={({ item, index }) => {
          if (item.type === 'loop') {
            return rail.loop ? (
              <LoopCard
                loop={rail.loop}
                color={line.color}
                textColor={line.textColor}
                map={map}
                onToggle={onToggle}
                onOpenBonplans={openBonplans}
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
            onPress: () => onToggle(item.station),
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
            <StationRow
              {...common}
              hideTop={item.hideTop}
              hideBottom={item.hideBottom}
              highlighted={index === focusIndex}
            />
          );
        }}
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
