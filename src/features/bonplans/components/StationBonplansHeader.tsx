import { View } from 'react-native';

import { ScreenHeader, Text } from '@/shared/ui';

import { bonplanCountLabel } from '../lib/stationSearch';
import type { StationBonplans } from '../types';
import { LineBadges } from './LineBadges';

type Props = { station: StationBonplans['station']; count: number; onBack: () => void };

/** En-tête de l'écran d'une station : nom, pastilles de lignes, nombre de bons plans. */
export function StationBonplansHeader({ station, count, onBack }: Props) {
  return (
    <ScreenHeader title={station.name} onBack={onBack}>
      <View className="flex-row items-center gap-2">
        <LineBadges lines={station.lines} />
        <Text variant="muted">{bonplanCountLabel(count)}</Text>
      </View>
    </ScreenHeader>
  );
}
