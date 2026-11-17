import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { bonplansOfflineQueries } from '@/features/bonplans/hooks';
import { discoverOfflineQueries } from '@/features/discover/hooks';
import { prefetchNetwork } from '@/features/network/lib/offlinePrefetch';
import { profileOfflineQueries } from '@/features/profile/hooks';
import { useReminderSync } from '@/features/reminders/hooks';
import { useTranslation } from '@/i18n';
import { useOfflinePrefetch } from '@/shared/hooks/useOfflinePrefetch';
import { prefetchQueries, type OfflineTask } from '@/shared/lib';
import { fonts, useThemeColors } from '@/shared/theme';

// Ce qui est téléchargé d'avance pour le hors-ligne, dans l'ordre : le réseau d'abord (le cœur de
// l'app), puis les autres onglets.
const OFFLINE_TASKS: OfflineTask[] = [
  prefetchNetwork,
  prefetchQueries([...bonplansOfflineQueries, ...discoverOfflineQueries, ...profileOfflineQueries]),
];

type IconName = keyof typeof Ionicons.glyphMap;

// Icône d'onglet : version pleine quand actif, contour sinon.
function tabIcon(base: IconName, outline: IconName) {
  return function TabIcon({
    color,
    size,
    focused,
  }: {
    color: ColorValue;
    size: number;
    focused: boolean;
  }) {
    return (
      <Ionicons
        name={focused ? base : outline}
        size={size}
        color={typeof color === 'number' ? undefined : (color ?? undefined)}
      />
    );
  };
}

export default function TabsLayout() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  // Dès qu'on est dans l'app avec du réseau : de quoi tout utiliser sous terre est téléchargé.
  useOfflinePrefetch(OFFLINE_TASKS);
  // Rappels du téléphone (si l'utilisateur les a activés) : recalculés quand la progression change.
  useReminderSync();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.hair },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.network'), tabBarIcon: tabIcon('map', 'map-outline') }}
      />
      <Tabs.Screen
        name="bons-plans"
        options={{
          title: t('tabs.bonplans'),
          tabBarIcon: tabIcon('pricetags', 'pricetags-outline'),
        }}
      />
      <Tabs.Screen
        name="decouvrir"
        options={{ title: t('tabs.discover'), tabBarIcon: tabIcon('compass', 'compass-outline') }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: t('tabs.profile'), tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
