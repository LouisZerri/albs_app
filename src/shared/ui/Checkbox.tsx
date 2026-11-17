import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Libellé à droite de la case (peut contenir un lien tappable séparément). */
  children: ReactNode;
};

/** Case à cocher : seule la case bascule l'état (le libellé garde ses propres taps). */
export function Checkbox({ checked, onChange, children }: Props) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-start gap-3">
      <Pressable
        onPress={() => onChange(!checked)}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}>
        <View
          className={cn(
            'mt-0.5 h-6 w-6 items-center justify-center rounded-md border',
            checked ? 'border-accent bg-accent' : 'border-hair bg-surface',
          )}>
          {checked ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
        </View>
      </Pressable>

      <View className="flex-1">{children}</View>
    </View>
  );
}
