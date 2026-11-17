import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useThemeColors } from '@/shared/theme';

import type { StationState } from '../lib/stationState';

const LANE_WIDTH = 52;
const ROW_HEIGHT = 56;
const HALF = ROW_HEIGHT / 2;
const RAIL_WIDTH = 4;

type Props = {
  state: StationState;
  color: string;
  textColor: string | null;
  isTerminus: boolean;
  isFirst: boolean;
  isLast: boolean;
  /** Coupe le demi-rail du bas (ex. juste au-dessus d'une fourche). */
  hideBottom?: boolean;
  /** Coupe le demi-rail du haut (ex. juste en dessous d'une fourche). */
  hideTop?: boolean;
};

/** La « voie » d'une station : segments de rail + nœud coloré selon l'état. UI pure. */
export function StationNode({ state, color, textColor, isTerminus, isFirst, isLast, hideBottom, hideTop }: Props) {
  const colors = useThemeColors();
  const railColor = state === 'todo' ? colors.hair : color;

  return (
    <View style={{ width: LANE_WIDTH, height: ROW_HEIGHT }} className="items-center justify-center">
      {!isFirst && !hideTop ? (
        <View style={{ position: 'absolute', top: 0, height: HALF, width: RAIL_WIDTH, backgroundColor: railColor }} />
      ) : null}
      {!isLast && !hideBottom ? (
        <View style={{ position: 'absolute', bottom: 0, height: HALF, width: RAIL_WIDTH, backgroundColor: railColor }} />
      ) : null}

      <NodeCircle state={state} color={color} textColor={textColor} big={isTerminus} />
    </View>
  );
}

function NodeCircle({
  state,
  color,
  textColor,
  big,
}: {
  state: StationState;
  color: string;
  textColor: string | null;
  big: boolean;
}) {
  const colors = useThemeColors();
  const size = big ? 30 : 24;

  if (state === 'visited') {
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, borderWidth: 3, borderColor: colors.bg }}>
        <Ionicons name="checkmark" size={size * 0.6} color={textColor ?? '#FFFFFF'} />
      </View>
    );
  }

  if (state === 'passed') {
    return (
      <View
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 4, borderColor: color, backgroundColor: colors.surface }}
      />
    );
  }

  const s = size - 6;
  return (
    <View
      style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: colors.hair, borderWidth: 3, borderColor: colors.bg }}
    />
  );
}
