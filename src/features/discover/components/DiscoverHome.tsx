import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { ErrorState, Screen, SkeletonList, Text } from '@/shared/ui';

import { useGhostStations, useJourneys } from '../hooks';
import { GhostStationCard } from './GhostStationCard';
import { JourneyCard } from './JourneyCard';

/** Onglet Découvrir : parcours thématiques et stations fantômes. */
export function DiscoverHome() {
  const router = useRouter();
  const colors = useThemeColors();
  const journeys = useJourneys();
  const ghosts = useGhostStations();

  const refresh = () => {
    void journeys.refetch();
    void ghosts.refetch();
  };

  if (journeys.isPending || ghosts.isPending) {
    return (
      <Screen padded={false}>
        <SkeletonList className="pt-4" />
      </Screen>
    );
  }

  if (journeys.isError || ghosts.isError) {
    return (
      <Screen>
        <ErrorState
          error={journeys.error ?? ghosts.error}
          message="Impossible de charger les parcours."
          onRetry={refresh}
        />
      </Screen>
    );
  }

  const unlocked = ghosts.data.filter((g) => g.unlocked).length;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerClassName="gap-3 px-5 pb-8 pt-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={journeys.isRefetching || ghosts.isRefetching}
            onRefresh={refresh}
            tintColor={colors.accent}
          />
        }
      >
        <View className="gap-1 pb-1">
          <Text variant="title">Découvrir</Text>
          <Text variant="muted">Des idées de parcours et les secrets du réseau.</Text>
        </View>

        <Text variant="label">Parcours</Text>
        {journeys.data.map((journey) => (
          <JourneyCard
            key={journey.key}
            journey={journey}
            onPress={() => router.push(`/discover/journey/${journey.key}`)}
          />
        ))}

        <View className="pt-3">
          <Text variant="label">
            Stations fantômes · {unlocked}/{ghosts.data.length}
          </Text>
          <Text variant="muted">
            Fermées ou jamais ouvertes, on les traverse sans les voir. Descends aux stations qui les
            encadrent pour découvrir leur histoire.
          </Text>
        </View>
        {ghosts.data.map((ghost) => (
          <GhostStationCard key={ghost.key} ghost={ghost} />
        ))}
      </ScrollView>
    </Screen>
  );
}
