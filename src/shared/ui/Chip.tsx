import { Pressable } from 'react-native';

import { fonts } from '@/shared/theme';
import { Text } from './Text';
import { cn } from '@/shared/utils/cn';

type Props = { label: string; active: boolean; onPress: () => void };

/** Puce sélectionnable (filtre ou choix). Hauteur 44 pt = cible tactile minimale. UI pure. */
export function Chip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={cn(
        'h-11 justify-center rounded-full border px-4 active:opacity-70',
        active ? 'border-accent bg-accent' : 'border-hair bg-surface',
      )}
    >
      <Text variant="muted" color={active ? 'white' : 'ink'} style={{ fontFamily: fonts.semibold }}>
        {label}
      </Text>
    </Pressable>
  );
}
