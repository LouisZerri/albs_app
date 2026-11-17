import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, View } from 'react-native';

import { usePullToRefresh } from '@/shared/hooks/usePullToRefresh';
import { useThemeColors } from '@/shared/theme';
import { ErrorState, ScreenHeader, SkeletonList, Text } from '@/shared/ui';

import { useBonplanActions, useFavorites } from '../hooks';
import { coordinateOf } from '../lib/distance';
import { bonplanCountLabel } from '../lib/stationSearch';
import { BonplanCard } from './BonplanCard';

/** Mes favoris : les bons plans enregistrés, toutes stations confondues. */
export function FavoritesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { data, error, isPending, isError, refetch } = useFavorites();
  const { refreshing, refresh } = usePullToRefresh(refetch);
  const { toggleFavorite, openDirections } = useBonplanActions();

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title="Mes favoris" onBack={() => router.back()}>
        {data ? <Text variant="muted">{bonplanCountLabel(data.length)}</Text> : null}
      </ScreenHeader>

      {isPending ? (
        <SkeletonList count={4} className="pt-4" />
      ) : isError ? (
        <ErrorState
          error={error}
          message="Impossible de charger tes favoris."
          onRetry={() => refetch()}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(bonplan) => String(bonplan.id)}
          renderItem={({ item }) => (
            <BonplanCard
              // Hors contexte d'une station : pas de distance, on affiche le nom de la station.
              bonplan={{ ...item, distance: null }}
              showStation
              onPress={() => router.push(`/bonplans/${item.stationId}`)}
              onToggleFavorite={() => toggleFavorite(item)}
              onDirections={coordinateOf(item) ? () => openDirections(item) : undefined}
            />
          )}
          contentContainerClassName="grow gap-3 px-5 py-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center gap-1.5 px-6">
              <Text variant="subtitle" className="text-center">
                Aucun favori pour le moment
              </Text>
              <Text variant="muted" className="text-center">
                Touche l’étoile d’un bon plan pour le retrouver ici.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
