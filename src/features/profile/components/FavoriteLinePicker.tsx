import { Pressable, View } from 'react-native';

import { LineBadge } from '@/features/network/components';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

type Line = { id: number; number: string; color: string; textColor: string | null };

type Props = {
  lines: Line[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

/** Sélecteur de ligne favorite : grille de pastilles + option « Aucune ». UI pure. */
export function FavoriteLinePicker({ lines, selectedId, onSelect }: Props) {
  return (
    <View className="gap-3">
      <Text variant="label">Ligne favorite</Text>

      <View className="flex-row flex-wrap gap-2.5">
        <Pressable
          onPress={() => onSelect(null)}
          className={cn(
            'items-center justify-center rounded-pill border px-4',
            selectedId === null ? 'border-accent bg-accentSoft' : 'border-hair bg-surface',
          )}>
          <Text
            variant={selectedId === null ? 'subtitle' : 'muted'}
            color={selectedId === null ? 'accent' : undefined}
            className="text-sm">
            Aucune
          </Text>
        </Pressable>

        {lines.map((line) => {
          const active = line.id === selectedId;
          return (
            <Pressable
              key={line.id}
              onPress={() => onSelect(line.id)}
              className={cn(
                'rounded-full border-2',
                active ? 'border-accent' : 'border-transparent',
              )}>
              <LineBadge number={line.number} color={line.color} textColor={line.textColor} size={38} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
