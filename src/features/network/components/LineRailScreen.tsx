import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useBadgeCelebration } from '@/features/badges';
import { colors } from '@/shared/theme';
import { Button, Screen, Text } from '@/shared/ui';

import { PROGRESS_KEY, useLineDetail, useMyProgress, useStationFeedback, useToggleStation } from '../hooks';
import { displayStations, getBranches, isForkStation } from '../lib/forkModel';
import { getLoop, isLoopStation } from '../lib/loopModel';
import { progressMap, stationState, type StationState } from '../lib/stationState';
import type { ProgressEntry, Station } from '../types';
import { ForkRow } from './ForkRow';
import { LineHeader } from './LineHeader';
import { LoopCard } from './LoopCard';
import { StationRow } from './StationRow';

/** L'aide « Touche une station… » n'est affichée que tant que l'utilisateur a coché moins de stations que ça. */
const HINT_UNTIL_STATIONS = 5;

type RailItem =
  | { type: 'station'; station: Station; hideTop: boolean; hideBottom: boolean }
  | { type: 'fork'; station: Station }
  | { type: 'loop' };

/** Écran « rail » d'une ligne : en-tête + liste tappable des stations + célébration badges. */
export function LineRailScreen({ id }: { id: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { celebrate } = useBadgeCelebration();
  const lineQuery = useLineDetail(id);
  const progressQuery = useMyProgress();
  const toggle = useToggleStation();
  const feedback = useStationFeedback();
  const [branch, setBranch] = useState<string | null>(null);

  const map = useMemo(() => progressMap(progressQuery.data ?? []), [progressQuery.data]);

  // À chaque ouverture d'une ligne : resynchronise la progression (propagation hub cross-lignes).
  useFocusEffect(
    useCallback(() => {
      void queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
    }, [queryClient]),
  );

  const onToggle = (station: Station) => {
    // Lecture du cache le plus frais (et pas du `map` mémoïsé) → cycle fiable en rafale.
    const entries = queryClient.getQueryData<ProgressEntry[]>(PROGRESS_KEY) ?? [];
    const current = stationState(entries.find((e) => e.stationId === station.id));
    // Cycle : à faire → passé → descendu → à faire.
    const next: StationState =
      current === 'todo' ? 'passed' : current === 'passed' ? 'visited' : 'todo';
    const nextFlags =
      next === 'passed'
        ? { passed: true, stopped: false }
        : next === 'visited'
          ? { passed: true, stopped: true }
          : { passed: false, stopped: false };

    feedback(next); // son + haptique immédiats

    toggle.mutate(
      { stationId: station.id, ...nextFlags },
      { onSuccess: (res) => celebrate(res.newBadges) },
    );
  };

  const openBonplans = (station: Station) => router.push(`/bonplans/${station.id}`);

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
        <View className="flex-1 items-center justify-center gap-4">
          <Text variant="muted" className="text-center">
            Impossible de charger la ligne.
          </Text>
          <Button label="Réessayer" variant="secondary" onPress={() => lineQuery.refetch()} />
        </View>
      </Screen>
    );
  }

  const line = lineQuery.data;
  const branches = getBranches(line.stations);
  const selectedBranch = branch ?? branches[0]?.key ?? null;
  const shown = branches.length > 0 ? displayStations(line.stations, selectedBranch) : line.stations;
  const forkIndex = branches.length > 0 ? shown.findIndex(isForkStation) : -1;
  // Les branches sont-elles affichées EN DESSOUS de la fourche (ex. ligne 7) ?
  const afterFork = forkIndex >= 0 ? shown[forkIndex + 1] : undefined;
  const branchesBelow = afterFork != null && !isForkStation(afterFork) && afterFork.branch !== null;

  // Compte sur les vraies stations (les deux branches), hors marqueur de fourche.
  const realStations = line.stations.filter((s) => !isForkStation(s));
  const total = realStations.length;
  const visited = realStations.filter((s) => map.get(s.id)?.stopped).length;
  const percent = total > 0 ? Math.round((visited / total) * 100) : 0;

  // Construit la liste à rendre : stations + une éventuelle fourche/boucle collapsée.
  const loop = getLoop(line);
  const railData: RailItem[] = [];
  if (loop) {
    let loopDone = false;
    for (const s of shown) {
      if (isLoopStation(s)) {
        if (!loopDone) {
          railData.push({ type: 'loop' });
          loopDone = true;
        }
        continue;
      }
      railData.push({ type: 'station', station: s, hideTop: false, hideBottom: false });
    }
  } else {
    shown.forEach((s, i) => {
      if (isForkStation(s)) {
        railData.push({ type: 'fork', station: s });
      } else {
        railData.push({
          type: 'station',
          station: s,
          hideBottom: !branchesBelow && i === forkIndex - 1,
          hideTop: branchesBelow && i === forkIndex + 1,
        });
      }
    });
  }

  return (
    <View className="flex-1 bg-bg">
      <LineHeader
        line={line}
        visited={visited}
        total={total}
        percent={percent}
        onBack={() => router.back()}
      />

      {/* Aide de prise en main : disparaît une fois le geste acquis (quelques stations cochées). */}
      {map.size < HINT_UNTIL_STATIONS ? (
        <View className="px-5 py-2.5">
          <Text variant="muted">Touche une station : passé → descendu → à faire 👆</Text>
        </View>
      ) : null}

      <FlatList
        data={railData}
        keyExtractor={(item, index) => (item.type === 'loop' ? `loop-${index}` : String(item.station.id))}
        renderItem={({ item, index }) => {
          if (item.type === 'loop') {
            return loop ? (
              <LoopCard
                loop={loop}
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
            isLast: index === railData.length - 1,
            onPress: () => onToggle(item.station),
            onOpenBonplans: () => openBonplans(item.station),
          };
          return item.type === 'fork' ? (
            <ForkRow
              {...common}
              branches={branches}
              selected={selectedBranch}
              onSelect={setBranch}
              branchesBelow={branchesBelow}
            />
          ) : (
            <StationRow {...common} hideTop={item.hideTop} hideBottom={item.hideBottom} />
          );
        }}
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
