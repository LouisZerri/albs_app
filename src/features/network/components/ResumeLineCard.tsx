import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps, View } from 'react-native';

import { colors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import type { LineStats } from '../types';
import { LineBadge } from './LineBadge';

type Props = { line: LineStats; onPress: PressableProps['onPress'] };

/** Raccourci « reprendre » : la ligne en cours la plus avancée, et ce qu'il reste à y visiter. UI pure. */
export function ResumeLineCard({ line, onPress }: Props) {
  const remaining = line.total - line.visited;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continuer la ligne ${line.number}, plus que ${remaining} stations`}
      className="flex-row items-center gap-3 rounded-card bg-accentSoft p-3 active:opacity-70"
    >
      <LineBadge number={line.number} color={line.color} textColor={line.textColor} />
      <View className="flex-1">
        <Text variant="subtitle" color="accent">
          Continuer la ligne {line.number}
        </Text>
        <Text variant="muted" color="accent">
          Plus que {remaining} {remaining > 1 ? 'stations' : 'station'} à visiter
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color={colors.accent} />
    </Pressable>
  );
}
