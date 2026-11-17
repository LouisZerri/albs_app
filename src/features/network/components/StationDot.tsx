import { View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { MapMarkerBox } from '@/shared/ui';

import type { StationState } from '../lib/stationState';

/** Point d'une station sur la carte, coloré selon son état ; plus gros quand elle est sélectionnée. UI pure. */
export function StationDot({ state, selected }: { state: StationState; selected: boolean }) {
  const colors = useThemeColors();
  const size = selected ? 15 : 9;

  return (
    // Boîte de 24 pt centrée sur la station : zone stable autour du point, quelle que soit sa taille.
    <MapMarkerBox size={24}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          backgroundColor: colors[state],
          borderWidth: selected ? 2.5 : 1.5,
          borderColor: colors.white,
        }}
      />
    </MapMarkerBox>
  );
}
