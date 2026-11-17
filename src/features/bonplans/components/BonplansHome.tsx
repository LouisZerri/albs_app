import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { usePullToRefresh } from '@/shared/hooks/usePullToRefresh';
import { useThemeColors } from '@/shared/theme';
import { ErrorState, Screen, SearchInput, Skeleton, SkeletonList, Text } from '@/shared/ui';

import { useBonplanStations, useVisitedStationIds } from '../hooks';
import { filterStations, linesOf } from '../lib/stationSearch';
import { BonplanStationRow } from './BonplanStationRow';
import { StationFilters } from './StationFilters';

/** Onglet Bons plans : recherche + liste des stations ayant des bons plans. */
export function BonplansHome() {
  const colors = useThemeColors();
  const { t } = useTranslation('bonplans');
  const router = useRouter();
  const { data, error, isPending, isError, refetch } = useBonplanStations();
  const { refreshing, refresh } = usePullToRefresh(refetch);
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
        <ErrorState error={error} message={t('home.loadError')} onRetry={() => refetch()} />
      </Screen>
    );
  }

  const stations = filterStations(data, { query, lineId, visitedOnly }, visitedIds);

  return (
    <Screen padded={false}>
      <View className="gap-3 px-5 pb-3 pt-1">
        <View className="flex-row items-start gap-3">
          <View className="flex-1 gap-1">
            <Text variant="title">{t('home.title')}</Text>
            <Text variant="muted">{t('home.subtitle')}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/bonplans/favorites')}
            accessibilityRole="button"
            accessibilityLabel={t('home.favoritesA11y')}
            className="h-11 w-11 items-center justify-center rounded-full border border-hair bg-surface active:opacity-70"
          >
            <Ionicons name="star" size={20} color={colors.passed} />
          </Pressable>
        </View>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('home.searchPlaceholder')}
        />
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
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
        }
        // Message de liste vide, selon la cause (aucune donnée, « Mes stations », autres filtres).
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6">
            <Text variant="muted" className="text-center">
              {data.length === 0
                ? t('home.emptyNone')
                : visitedOnly
                  ? t('home.emptyVisited')
                  : t('home.emptySearch')}
            </Text>
          </View>
        }
      />
    </Screen>
  );
}
