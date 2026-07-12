import { Pressable, type PressableProps, View } from 'react-native';

import { fonts } from '@/shared/theme';
import { Text } from '@/shared/ui';

import type { StationState } from '../lib/stationState';
import type { Station } from '../types';
import { CorrespondenceDots } from './CorrespondenceDots';
import { StationNode } from './StationNode';

type Props = {
  station: Station;
  state: StationState;
  color: string;
  textColor: string | null;
  isFirst: boolean;
  isLast: boolean;
  onPress: PressableProps['onPress'];
  hideBottom?: boolean;
  hideTop?: boolean;
};

/** Une station dans le rail. Toute la ligne est tappable (cible large). */
export function StationRow({ station, state, color, textColor, isFirst, isLast, onPress, hideBottom, hideTop }: Props) {
  const isTerminus = isFirst || isLast;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center pr-4 active:bg-hair/40"
      accessibilityRole="button"
      accessibilityState={{ checked: state === 'visited' }}>
      <StationNode
        state={state}
        color={color}
        textColor={textColor}
        isTerminus={isTerminus}
        isFirst={isFirst}
        isLast={isLast}
        hideBottom={hideBottom}
        hideTop={hideTop}
      />

      <View className="flex-1 flex-row items-center gap-2">
        <Text
          variant={isTerminus ? 'subtitle' : 'body'}
          numberOfLines={1}
          className="shrink"
          style={isTerminus ? { fontFamily: fonts.extrabold } : undefined}>
          {station.name}
        </Text>
        <CorrespondenceDots items={station.correspondences} />
        {state === 'passed' ? (
          <Text variant="label" color="passed">
            Passé
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
