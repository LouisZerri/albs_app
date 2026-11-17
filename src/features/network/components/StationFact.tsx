import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

/** « Pourquoi descendre ici ? » : l'anecdote d'une station, dans un encart discret. UI pure. */
export function StationFact({ fact, className }: { fact: string; className?: string }) {
  const colors = useThemeColors();

  return (
    <View className={cn('flex-row gap-2 rounded-2xl bg-accentSoft p-3', className)}>
      <Ionicons name="sparkles" size={16} color={colors.accent} style={{ marginTop: 2 }} />
      <Text variant="muted" color="ink" className="flex-1">
        {fact}
      </Text>
    </View>
  );
}
