import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { usePullToRefresh } from '@/shared/hooks/usePullToRefresh';
import { useThemeColors } from '@/shared/theme';
import { ErrorState, SearchInput, SkeletonList } from '@/shared/ui';

import { useNetworkStats, useStationSearch } from '../hooks';
import { resumeLine } from '../lib/resumeLine';
import type { NetworkStats } from '../types';
import { LineRow } from './LineRow';
import { NetworkProgressCard } from './NetworkProgressCard';
import { StationSearchResults } from './StationSearchResults';

/** Vue Liste de l'onglet Réseau : recherche de station, progression globale, liste des lignes. */
export function NetworkList() {
  const { t } = useTranslation('network');
  const router = useRouter();
  const { data, error, isPending, isError, refetch } = useNetworkStats();
  const { refreshing, refresh } = usePullToRefresh(refetch);
  const [query, setQuery] = useState('');
  const search = useStationSearch(query);

  if (isPending) {
    return <SkeletonList className="pt-1" />;
  }

  if (isError || !data) {
    return <ErrorState error={error} message={t('list.loadError')} onRetry={() => refetch()} />;
  }

  return (
    <View className="flex-1">
      <View className="px-5 pb-3">
        <SearchInput value={query} onChangeText={setQuery} placeholder={t('searchPlaceholder')} />
      </View>

      {search.searching ? (
        <StationSearchResults
          hits={search.hits}
          isPending={search.isPending}
          isError={search.isError}
          onSelect={(hit) =>
            router.push({
              pathname: '/line/[id]',
              params: { id: hit.line.lineId, station: hit.name },
            })
          }
        />
      ) : (
        <LineList data={data} refreshing={refreshing} onRefresh={refresh} />
      )}
    </View>
  );
}

type LineListProps = { data: NetworkStats; refreshing: boolean; onRefresh: () => void };

/** La liste des lignes, précédée de la progression globale. */
function LineList({ data, refreshing, onRefresh }: LineListProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <FlatList
      data={data.lines}
      keyExtractor={(line) => String(line.id)}
      renderItem={({ item }) => (
        <LineRow line={item} onPress={() => router.push(`/line/${item.id}`)} />
      )}
      contentContainerClassName="gap-3 px-5 pb-6"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      ListHeaderComponent={
        <View className="pb-1 pt-1">
          <NetworkProgressCard
            percent={data.percent}
            visited={data.stations.visited}
            total={data.stations.total}
            resume={resumeLine(data)}
            onResume={(lineId) => router.push(`/line/${lineId}`)}
          />
        </View>
      }
    />
  );
}
