import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { colors } from '@/shared/theme';
import { ErrorState, SearchInput, SkeletonList } from '@/shared/ui';

import { useNetworkStats, useStationSearch } from '../hooks';
import { resumeLine } from '../lib/resumeLine';
import type { NetworkStats } from '../types';
import { LineRow } from './LineRow';
import { NetworkProgressCard } from './NetworkProgressCard';
import { ResumeLineCard } from './ResumeLineCard';
import { StationSearchResults } from './StationSearchResults';

/** Vue Liste de l'onglet Réseau : recherche de station, progression globale, liste des lignes. */
export function NetworkList() {
  const router = useRouter();
  const { data, error, isPending, isError, refetch, isRefetching } = useNetworkStats();
  const [query, setQuery] = useState('');
  const search = useStationSearch(query);

  if (isPending) {
    return (
      <SkeletonList className="pt-1" />
    );
  }

  if (isError) {
    return (
      <ErrorState error={error} message="Impossible de charger le réseau." onRetry={() => refetch()} />
    );
  }

  return (
    <View className="flex-1">
      <View className="px-5 pb-3">
        <SearchInput value={query} onChangeText={setQuery} placeholder="Rechercher une station…" />
      </View>

      {search.searching ? (
        <StationSearchResults
          hits={search.hits}
          isPending={search.isPending}
          isError={search.isError}
          onSelect={(hit) =>
            router.push({ pathname: '/line/[id]', params: { id: hit.line.lineId, station: hit.name } })
          }
        />
      ) : (
        <LineList data={data} isRefetching={isRefetching} onRefresh={() => void refetch()} />
      )}
    </View>
  );
}

type LineListProps = { data: NetworkStats; isRefetching: boolean; onRefresh: () => void };

/** La liste des lignes, précédée de la progression globale. */
function LineList({ data, isRefetching, onRefresh }: LineListProps) {
  const router = useRouter();
  const resume = resumeLine(data.lines);

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
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.accent} />
      }
      ListHeaderComponent={
        <View className="gap-3 pb-1 pt-1">
          <NetworkProgressCard
            percent={data.percent}
            visited={data.stations.visited}
            total={data.stations.total}
          />
          {resume ? <ResumeLineCard line={resume} onPress={() => router.push(`/line/${resume.id}`)} /> : null}
        </View>
      }
    />
  );
}
