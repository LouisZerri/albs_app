import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { colors } from '@/shared/theme';
import { Button, Text } from '@/shared/ui';

import { useNetworkStats } from '../hooks';
import { LineRow } from './LineRow';

/** Vue Liste de l'onglet Réseau : progression globale + liste des lignes. Contenu seul. */
export function NetworkList() {
  const router = useRouter();
  const { data, isPending, isError, refetch, isRefetching } = useNetworkStats();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text variant="muted" className="text-center">
          Impossible de charger le réseau.
        </Text>
        <Button label="Réessayer" variant="secondary" onPress={() => refetch()} />
      </View>
    );
  }

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
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
      }
      ListHeaderComponent={
        <Text variant="muted" className="pb-3 pt-1">
          {data.percent}% du réseau · {data.stations.visited}/{data.stations.total} stations
        </Text>
      }
    />
  );
}
