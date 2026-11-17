import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { ProgressBar, ShineOverlay, Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { LineStats } from '../types';
import { LineBadge } from './LineBadge';

type Props = { line: LineStats; onPress: PressableProps['onPress'] };

/** Une ligne dans la liste Réseau : pastille + numéro + terminus + progression (+ reflet si 100%). UI pure. */
export function LineRow({ line, onPress }: Props) {
  const colors = useThemeColors();
  const complete = line.percent === 100;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-card border p-3 active:opacity-70',
        complete ? 'overflow-hidden border-visited bg-visitedSoft' : 'border-hair bg-surface',
      )}>
      <LineBadge number={line.number} color={line.color} textColor={line.textColor} />

      <View className="flex-1 gap-2">
        {/* Titre court + terminus sur une ligne : toutes les cartes ont la même hauteur, sans vide. */}
        <View>
          <Text variant="subtitle">Ligne {line.number}</Text>
          <Text variant="muted" numberOfLines={1}>
            {line.name}
          </Text>
        </View>

        <ProgressBar percent={line.percent} color={line.color} />

        <View className="flex-row items-center justify-between">
          <Text variant="muted">
            {line.visited}/{line.total} stations
          </Text>
          {complete ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="checkmark-circle" size={16} color={colors.visited} />
              <Text variant="muted" color="visited">
                100%
              </Text>
            </View>
          ) : (
            <Text variant="muted">{line.percent}%</Text>
          )}
        </View>
      </View>

      {complete ? <ShineOverlay /> : null}
    </Pressable>
  );
}
