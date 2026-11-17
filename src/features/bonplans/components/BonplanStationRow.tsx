import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import { bonplanCountLabel, lineNumbersLabel } from '../lib/stationSearch';
import type { BonplanStation } from '../types';
import { LineBadges } from './LineBadges';

type Props = { station: BonplanStation; onPress: PressableProps['onPress'] };

/** Une station dans la liste Bons plans : nom + pastilles de lignes + nombre de bons plans. UI pure. */
export function BonplanStationRow({ station, onPress }: Props) {
  const colors = useThemeColors();
  const label = bonplanCountLabel(station.count);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${station.name}, ${lineNumbersLabel(station.lines)}, ${label}`}
      className="flex-row items-center gap-3 rounded-card border border-hair bg-surface p-3 active:opacity-70"
    >
      <View className="flex-1 gap-1.5">
        <Text variant="subtitle" numberOfLines={1}>
          {station.name}
        </Text>
        <View className="flex-row items-center gap-2">
          <LineBadges lines={station.lines} />
          <Text variant="muted">{label}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}
