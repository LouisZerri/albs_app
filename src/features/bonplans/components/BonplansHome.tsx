import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { ErrorState, Screen, SearchInput, Skeleton, SkeletonList, Text } from '@/shared/ui';

import { useBonplanStations, useVisitedStationIds } from '../hooks';
import { filterStations, linesOf } from '../lib/stationSearch';
import { BonplanStationRow } from './BonplanStationRow';
import { StationFilters } from './StationFilters';

/** Onglet Bons plans : recherche + liste des stations ayant des bons plans. */
export function BonplansHome() {
  const colors = useThemeColors();
  const router = useRouter();
  const { data, error, isPending, isError, refetch, isRefetching } = useBonplanStations();
  const visitedIds = useVisitedStationIds();
  const [query, setQuery] = useState('');
  const [lineId, setLineId] = useState<number | null>(null);
  const [visitedOnly, setVisitedOnly] = useState(false);

  if (isPending) {
    return (
      <Screen padded={false}>
        <View className="gap-3 px-5 pb-3 pt-1">
          <Skeleton className="h-9 w-2/5" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </View>
        <SkeletonList />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState
          error={error}
          message="Impossible de charger les bons plans."
          onRetry={() => refetch()}
        />
      </Screen>
    );
  }

  const stations = filterStations(data, { query, lineId, visitedOnly }, visitedIds);

  return (
    <Screen padded={false}>
      <View className="gap-3 px-5 pb-3 pt-1">
        <View className="flex-row items-start gap-3">
          <View className="flex-1 gap-1">
            <Text variant="title">Bons plans</Text>
            <Text variant="muted">Les bonnes adresses à deux pas des stations.</Text>
          </View>
          <Pressable
            onPress={() => router.push('/bonplans/favorites')}
            accessibilityRole="button"
            accessibilityLabel="Mes favoris"
            className="h-11 w-11 items-center justify-center rounded-full border border-hair bg-surface active:opacity-70"
          >
            <Ionicons name="star" size={20} color={colors.passed} />
          </Pressable>
        </View>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Rechercher une station…" />
      </View>

      <StationFilters
        lines={linesOf(data)}
        lineId={lineId}
        onLineChange={setLineId}
        visitedOnly={visitedOnly}
        onVisitedOnlyChange={setVisitedOnly}
      />

      <FlatList
        data={stations}
        keyExtractor={(station) => String(station.id)}
        renderItem={({ item }) => (
          <BonplanStationRow station={item} onPress={() => router.push(`/bonplans/${item.id}`)} />
        )}
        contentContainerClassName="grow gap-3 px-5 pb-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6">
            <Text variant="muted" className="text-center">
              {emptyMessage(data.length, visitedOnly)}
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

/** Message de liste vide, selon la cause (aucune donnée, filtre « Mes stations », autres filtres). */
function emptyMessage(total: number, visitedOnly: boolean): string {
  if (total === 0) return 'Aucun bon plan pour le moment.';
  if (visitedOnly)
    return 'Aucune station visitée ne correspond. Descends à une station pour la retrouver ici.';
  return 'Aucune station ne correspond à ta recherche.';
}
