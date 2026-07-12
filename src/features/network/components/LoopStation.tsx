import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps, View } from 'react-native';

import { colors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import type { StationState } from '../lib/stationState';
import type { Station } from '../types';
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
};

/** Une station dans une boucle : petit nœud cochable + demi-rails (comme le rail principal). UI pure. */
export function LoopStation({ station, state, color, textColor, isFirst, isLast, onPress }: Props) {
  const railColor = state === 'todo' ? colors.hair : color;

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-2 active:opacity-60" style={{ height: ROW_H }}>
      <View style={{ width: SIZE, height: ROW_H }} className="items-center justify-center">
        {!isFirst ? (
          <View style={{ position: 'absolute', top: 0, height: HALF, width: 3, backgroundColor: railColor }} />
        ) : null}
        {!isLast ? (
          <View style={{ position: 'absolute', bottom: 0, height: HALF, width: 3, backgroundColor: railColor }} />
        ) : null}
        <LoopNode state={state} color={color} textColor={textColor} />
      </View>

      <Text variant="body" numberOfLines={1} className="shrink">
        {station.name}
      </Text>
      <CorrespondenceDots items={station.correspondences} />
    </Pressable>
  );
}

function LoopNode({ state, color, textColor }: { state: StationState; color: string; textColor: string | null }) {
  if (state === 'visited') {
    return (
      <View
        className="items-center justify-center"
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: color }}>
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
