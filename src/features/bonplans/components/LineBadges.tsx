import { View } from 'react-native';

import { LineBadge } from '@/features/network/components';
import type { Correspondence } from '@/features/network/types';

/** Les pastilles des lignes desservant une station, côte à côte. UI pure. */
export function LineBadges({ lines }: { lines: Correspondence[] }) {
  return (
    <View className="flex-row items-center gap-1">
      {lines.map((line) => (
        <LineBadge
          key={line.lineId}
          number={line.number}
          color={line.color}
          textColor={line.textColor}
          size={22}
        />
      ))}
    </View>
  );
}
