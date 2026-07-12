import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { useAuth } from '@/features/auth/store';
import { useNetworkStats } from '@/features/network/hooks';
import { colors } from '@/shared/theme';
import { Button, Screen, Text } from '@/shared/ui';

import { useBadges } from '../hooks';
import { BadgesTab } from './BadgesTab';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import { ProfileHeader } from './ProfileHeader';
import { WarningsBanner } from './WarningsBanner';
import { ProfileTabs, type ProfileTab } from './ProfileTabs';
import { ProgressionTab } from './ProgressionTab';
import { StatsCard } from './StatsCard';

/** Écran Profil : identité + statistiques + onglets Badges/Progression + déconnexion. */
export function ProfileHome() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const stats = useNetworkStats();
  const badges = useBadges();
  const [tab, setTab] = useState<ProfileTab>('badges');

  const startedCount = useMemo(
    () => (stats.data?.lines ?? []).filter((l) => l.passed > 0 || l.visited > 0).length,
    [stats.data],
  );

  if (stats.isPending || badges.isPending) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} />
        </View>
      </Screen>
    );
  }

  if (stats.isError || !stats.data || badges.isError || !badges.data) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4">
          <Text variant="muted" className="text-center">
            Impossible de charger le profil.
          </Text>
          <Button
            label="Réessayer"
            variant="secondary"
            onPress={() => {
              void stats.refetch();
              void badges.refetch();
            }}
          />
        </View>
      </Screen>
    );
  }

  const s = stats.data;
  const earned = badges.data.filter((b) => b.earned).length;

  // Emojis des badges en vitrine, dans l'ordre choisi par l'utilisateur.
  const iconById = new Map(badges.data.map((b) => [b.id, b.icon]));
  const showcase = (user?.displayedBadges ?? [])
    .map((id) => iconById.get(id))
    .filter((icon): icon is string => Boolean(icon));
  const refreshing = stats.isFetching || badges.isFetching;
  const refresh = () => {
    void stats.refetch();
    void badges.refetch();
  };

  return (
    <Screen padded={false}>
      {/* Le switch (index 1) reste épinglé en haut : les listes longues défilent dessous. */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
        }>
        <View className="gap-4 pt-4">
          <WarningsBanner />
          {user?.isEmailVerified === false ? <EmailVerificationBanner /> : null}

          <View>
            <Pressable
              onPress={() => void signOut()}
              className="absolute left-0 top-0 z-10 p-1 active:opacity-60"
              accessibilityLabel="Se déconnecter">
              <Ionicons name="log-out-outline" size={24} color={colors.danger} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/profile/edit')}
              className="absolute right-0 top-0 z-10 p-1 active:opacity-60"
              accessibilityLabel="Modifier le profil">
              <Ionicons name="settings-outline" size={22} color={colors.muted} />
            </Pressable>
            <ProfileHeader
              username={user?.username ?? ''}
              email={user?.email ?? ''}
              avatarUrl={user?.avatarUrl}
              createdAt={user?.createdAt}
              favoriteLine={user?.favoriteLine}
              showcase={showcase}
              engagement={s.stations.passed + s.stations.visited}
            />
          </View>

          <StatsCard
            passed={s.stations.passed}
            visited={s.stations.visited}
            totalStations={s.stations.total}
            badgesEarned={earned}
            badgesTotal={badges.data.length}
          />
        </View>

        <View className="bg-bg pb-3 pt-3">
          <ProfileTabs
            tab={tab}
            onChange={setTab}
            counts={{ badges: `${earned}/${badges.data.length}`, progression: `${startedCount}` }}
          />
        </View>

        <View className="gap-4">
          {tab === 'badges' ? (
            <BadgesTab badges={badges.data} />
          ) : (
            <ProgressionTab lines={s.lines} />
          )}

          <Button label="Se déconnecter" variant="secondary" onPress={() => void signOut()} />
        </View>
      </ScrollView>
    </Screen>
  );
}
