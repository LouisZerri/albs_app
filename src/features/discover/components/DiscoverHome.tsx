import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';

import { ChallengesCard } from '@/features/network/components';
import { useNetworkStats } from '@/features/network/hooks';
import { useTranslation } from '@/i18n';
import { usePullToRefresh } from '@/shared/hooks/usePullToRefresh';
import { useThemeColors } from '@/shared/theme';
import { ErrorState, Screen, SkeletonList, Text } from '@/shared/ui';

import { useGhostStations, useJourneys } from '../hooks';
import { GhostStationCard } from './GhostStationCard';
import { JourneyCard } from './JourneyCard';

/** Onglet Découvrir : défis en cours, parcours thématiques et stations fantômes. */
export function DiscoverHome() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation('discover');
  const journeys = useJourneys();
  const ghosts = useGhostStations();
  const stats = useNetworkStats();

  const { refreshing, refresh } = usePullToRefresh(journeys.refetch, ghosts.refetch);

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
          message={t('home.loadError')}
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
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
        }
      >
        <View className="gap-1 pb-1">
          <Text variant="title">{t('home.title')}</Text>
          <Text variant="muted">{t('home.subtitle')}</Text>
        </View>

        {/* Les défis viennent des statistiques du Réseau ; s'ils ne sont pas chargés, on s'en passe. */}
        {stats.data && stats.data.challenges.length > 0 ? (
          <ChallengesCard
            challenges={stats.data.challenges}
            onOpenLine={(lineId) => router.push(`/line/${lineId}`)}
          />
        ) : null}

        <Text variant="label" className="pt-2">
          {t('home.journeysLabel')}
        </Text>
        {journeys.data.map((journey) => (
          <JourneyCard
            key={journey.key}
            journey={journey}
            onPress={() => router.push(`/discover/journey/${journey.key}`)}
          />
        ))}

        <View className="pt-3">
          <Text variant="label">
            {t('home.ghostsLabel', { unlocked, total: ghosts.data.length })}
          </Text>
          <Text variant="muted">{t('home.ghostsIntro')}</Text>
        </View>
        {ghosts.data.map((ghost) => (
          <GhostStationCard key={ghost.key} ghost={ghost} />
        ))}
      </ScrollView>
    </Screen>
  );
}
