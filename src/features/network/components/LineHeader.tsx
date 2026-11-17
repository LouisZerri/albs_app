import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '@/shared/theme';
import { ProgressBar, Text } from '@/shared/ui';

import type { LineDetail } from '../types';
import { LineBadge } from './LineBadge';

type Props = {
  line: LineDetail;
  visited: number;
  total: number;
  percent: number;
  onBack: () => void;
};

/** En-tête de l'écran rail : bouton retour, pastille, noms, progression de la ligne. */
export function LineHeader({ line, visited, total, percent, onBack }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-b border-hair bg-surface px-5 pb-4"
      style={{ paddingTop: insets.top + 6 }}>
      <Pressable onPress={onBack} hitSlop={8} className="-ml-1 mb-2 h-8 w-8 items-center justify-center">
        <Ionicons name="chevron-back" size={26} color={colors.ink} />
      </Pressable>

      <View className="flex-row items-center gap-3">
        <LineBadge number={line.number} color={line.color} textColor={line.textColor} size={48} />
        <View className="flex-1">
          <Text variant="subtitle">Ligne {line.number}</Text>
          <Text variant="muted" numberOfLines={1}>
            {line.name}
          </Text>
        </View>
      </View>

      <View className="mt-3 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text variant="muted">
            {visited} / {total} stations visitées
          </Text>
          <Text variant="subtitle" color="accent">
            {percent}%
          </Text>
        </View>
        <ProgressBar percent={percent} color={line.color} />
      </View>
    </View>
  );
}
