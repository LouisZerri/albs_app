import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Text } from '@/shared/ui';

import type { LoopData } from '../lib/loopModel';
import { stationState } from '../lib/stationState';
import type { ProgressEntry, Station } from '../types';
import { LoopStation } from './LoopStation';

type Props = {
  loop: LoopData;
  color: string;
  textColor: string | null;
  map: Map<number, ProgressEntry>;
  onToggle: (station: Station) => void;
};

/** Bloc « Boucle » (ex. Boucle d'Auteuil, ligne 10) : deux groupes de stations par sens. */
export function LoopCard({ loop, color, textColor, map, onToggle }: Props) {
  return (
    <View
      className="my-1 ml-2 mr-4 rounded-card border p-3"
      style={{ backgroundColor: `${color}1A`, borderColor: `${color}66` }}>
      <View className="flex-row items-center gap-2">
        <Ionicons name="sync" size={18} color={color} />
        <Text variant="subtitle">{loop.label}</Text>
        <Text variant="muted" className="ml-auto">
          sens unique
        </Text>
      </View>

      {loop.groups.map((group) => (
        <View key={group.directionLabel} className="mt-3 gap-0.5">
          <View className="flex-row items-center gap-1">
            <Ionicons name="arrow-forward" size={13} color={color} />
            <Text variant="muted">{group.directionLabel}</Text>
          </View>

          <View className="pl-1">
            {group.stations.map((station, index) => {
              // Station seule dans son sens → rail des deux côtés (elle est sur la ligne).
              const solo = group.stations.length === 1;
              return (
                <LoopStation
                  key={station.id}
                  station={station}
                  state={stationState(map.get(station.id))}
                  color={color}
                  textColor={textColor}
                  isFirst={!solo && index === 0}
                  isLast={!solo && index === group.stations.length - 1}
                  onPress={() => onToggle(station)}
                />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
