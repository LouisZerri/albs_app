import { Stack } from 'expo-router';

import { useThemeColors } from '@/shared/theme';

export default function AuthLayout() {
  const colors = useThemeColors();

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
