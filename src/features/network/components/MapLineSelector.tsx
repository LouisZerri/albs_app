import { Pressable, ScrollView, View } from 'react-native';

import { cn } from '@/shared/utils/cn';

import type { LineGeo } from '../types';
import { LineBadge } from './LineBadge';

type Props = {
  lines: LineGeo[];
  selectedId: number | null;
  onToggle: (id: number) => void;
};

/** Bande de pastilles pour mettre une ligne en évidence sur la carte. UI pure. */
export function MapLineSelector({ lines, selectedId, onToggle }: Props) {
  return (
    <View className="absolute inset-x-0 bottom-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-3">
        {lines.map((line) => {
          const active = line.id === selectedId;
          const dim = selectedId !== null && !active;
          return (
            <Pressable key={line.id} onPress={() => onToggle(line.id)} style={{ opacity: dim ? 0.35 : 1 }}>
              <View
                className={cn(
                  'rounded-full p-0.5',
                  active ? 'border-2 border-ink' : 'border-2 border-transparent',
                )}
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 3,
                }}>
                <LineBadge number={line.number} color={line.color} textColor={line.textColor} size={38} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
