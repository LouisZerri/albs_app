import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useOfflinePrefetch } from '@/features/network/hooks';
import { fonts, useThemeColors } from '@/shared/theme';

type IconName = keyof typeof Ionicons.glyphMap;

// Icône d'onglet : version pleine quand actif, contour sinon.
function tabIcon(base: IconName, outline: IconName) {
  return function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    return <Ionicons name={focused ? base : outline} size={size} color={typeof color === 'number' ? undefined : (color ?? undefined)} />;
  };
}

export default function TabsLayout() {
  const colors = useThemeColors();
  // Dès qu'on est dans l'app avec du réseau : tout le réseau est téléchargé pour le hors-ligne.
  useOfflinePrefetch();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.hair },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Réseau', tabBarIcon: tabIcon('map', 'map-outline') }}
      />
      <Tabs.Screen
        name="bons-plans"
        options={{ title: 'Bons plans', tabBarIcon: tabIcon('pricetags', 'pricetags-outline') }}
      />
      <Tabs.Screen
        name="decouvrir"
        options={{ title: 'Découvrir', tabBarIcon: tabIcon('compass', 'compass-outline') }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
