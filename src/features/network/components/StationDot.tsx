import { View } from 'react-native';

import { colors } from '@/shared/theme';

import type { StationState } from '../lib/stationState';

const DOT_COLOR: Record<StationState, string> = {
  visited: colors.visited,
  passed: colors.passed,
  todo: '#C2C9D4',
};

/** Point d'une station sur la carte, coloré selon son état ; plus gros quand elle est sélectionnée. UI pure. */
export function StationDot({ state, selected }: { state: StationState; selected: boolean }) {
  const size = selected ? 15 : 9;

  return (
    // Boîte de 24 pt : zone stable autour du point, quelle que soit sa taille.
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          backgroundColor: DOT_COLOR[state],
          borderWidth: selected ? 2.5 : 1.5,
          borderColor: colors.white,
        }}
      />
    </View>
  );
}
