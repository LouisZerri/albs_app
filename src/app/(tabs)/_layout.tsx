import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors, fonts } from '@/shared/theme';

type IconName = keyof typeof Ionicons.glyphMap;

// Icône d'onglet : version pleine quand actif, contour sinon.
function tabIcon(base: IconName, outline: IconName) {
  return function TabIcon({ color, size, focused }: { color: string; size: number; focused: boolean }) {
    return <Ionicons name={focused ? base : outline} size={size} color={color} />;
  };
}

export default function TabsLayout() {
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
        name="forum"
        options={{ title: 'Forum', tabBarIcon: tabIcon('chatbubbles', 'chatbubbles-outline') }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
