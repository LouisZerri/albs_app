import { Pressable, ScrollView, View } from 'react-native';

import { LineBadge } from '@/features/network/components';
import type { Correspondence } from '@/features/network/types';
import { Chip } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

type Props = {
  lines: Correspondence[];
  lineId: number | null;
  onLineChange: (lineId: number | null) => void;
  visitedOnly: boolean;
  onVisitedOnlyChange: (visitedOnly: boolean) => void;
};

/** Filtres de l'accueil Bons plans : « Mes stations » + une pastille par ligne. UI pure. */
export function StationFilters({
  lines,
  lineId,
  onLineChange,
  visitedOnly,
  onVisitedOnlyChange,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // Un ScrollView rétrécit par défaut : sans ça, la liste en dessous rogne la bande de filtres.
      style={{ flexGrow: 0, flexShrink: 0 }}
      contentContainerClassName="items-center gap-2 px-5 pb-3"
    >
      <Chip
        label="✓ Mes stations"
        active={visitedOnly}
        onPress={() => onVisitedOnlyChange(!visitedOnly)}
      />

      {lines.map((line) => {
        const active = line.lineId === lineId;
        return (
          <Pressable
            key={line.lineId}
            onPress={() => onLineChange(active ? null : line.lineId)}
            accessibilityRole="button"
            accessibilityLabel={`Ligne ${line.number}`}
            accessibilityState={{ selected: active }}
            // Estompe les autres lignes quand une est choisie (comme sur la carte du Réseau).
            style={{ opacity: lineId !== null && !active ? 0.35 : 1 }}
          >
            <View
              className={cn(
                'rounded-full border-2 p-0.5',
                active ? 'border-ink' : 'border-transparent',
              )}
            >
              <LineBadge
                number={line.number}
                color={line.color}
                textColor={line.textColor}
                size={38}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
