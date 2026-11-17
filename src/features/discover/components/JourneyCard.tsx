import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { Card, ProgressBar, Text } from '@/shared/ui';

import type { Journey } from '../types';

/** Un parcours dans la liste : emoji, titre, accroche et avancement. UI pure. */
export function JourneyCard({ journey, onPress }: { journey: Journey; onPress: () => void }) {
  const colors = useThemeColors();
  const done = journey.total > 0 && journey.visited >= journey.total;

  return (
    <Card onPress={onPress} className="gap-3">
      <View className="flex-row items-center gap-3">
        <Text style={{ fontSize: 30, lineHeight: 36 }}>{journey.icon}</Text>
        <View className="flex-1">
          <Text variant="subtitle" numberOfLines={1}>
            {journey.title}
          </Text>
          <Text variant="muted" numberOfLines={2}>
            {journey.pitch}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <ProgressBar
            percent={journey.total > 0 ? (journey.visited / journey.total) * 100 : 0}
            color={done ? colors.visited : undefined}
          />
        </View>
        <Text variant="muted">
          {journey.visited}/{journey.total}
        </Text>
      </View>
    </Card>
  );
}
