import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { StationState } from '../lib/stationState';
import type { Station } from '../types';
import { BonplansLink } from './BonplansLink';
import { CorrespondenceDots } from './CorrespondenceDots';

const SIZE = 18;
const ROW_H = 34;
const HALF = ROW_H / 2;

type Props = {
  station: Station;
  state: StationState;
  color: string;
  textColor: string | null;
  isFirst: boolean;
  isLast: boolean;
  onPress: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  onOpenBonplans?: () => void;
  /** Station à repérer (visée par une recherche, ou sur le trajet en cours de saisie). */
  highlighted?: boolean;
};

/** Une station dans une boucle : petit nœud cochable + demi-rails (comme le rail principal). UI pure. */
export function LoopStation({
  station,
  state,
  color,
  textColor,
  isFirst,
  isLast,
  onPress,
  onLongPress,
  onOpenBonplans,
  highlighted,
}: Props) {
  const colors = useThemeColors();
  const railColor = state === 'todo' ? colors.hair : color;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={cn(
        'flex-row items-center gap-2 rounded-md active:opacity-60',
        highlighted && 'bg-accentSoft/60',
      )}
      style={{ height: ROW_H }}
    >
      <View style={{ width: SIZE, height: ROW_H }} className="items-center justify-center">
        {!isFirst ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              height: HALF,
              width: 3,
              backgroundColor: railColor,
            }}
          />
        ) : null}
        {!isLast ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              height: HALF,
              width: 3,
              backgroundColor: railColor,
            }}
          />
        ) : null}
        <LoopNode state={state} color={color} textColor={textColor} />
      </View>

      <Text variant="body" numberOfLines={1} className="shrink">
        {station.name}
      </Text>
      <CorrespondenceDots items={station.correspondences} />
      {state === 'visited' && station.bonplanCount > 0 && onOpenBonplans ? (
        <BonplansLink count={station.bonplanCount} onPress={onOpenBonplans} />
      ) : null}
    </Pressable>
  );
}

function LoopNode({
  state,
  color,
  textColor,
}: {
  state: StationState;
  color: string;
  textColor: string | null;
}) {
  const colors = useThemeColors();
  if (state === 'visited') {
    return (
      <View
        className="items-center justify-center"
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: color }}
      >
        <Ionicons name="checkmark" size={11} color={textColor ?? '#FFFFFF'} />
      </View>
    );
  }
  const isPassed = state === 'passed';
  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        borderWidth: 2.5,
        borderColor: isPassed ? color : colors.hair,
        backgroundColor: colors.surface,
      }}
    />
  );
}
