import type { ReactNode } from 'react';
import { Pressable, type PressableProps, View } from 'react-native';

import { cn } from '@/shared/utils/cn';

const BASE = 'rounded-card border border-hair bg-surface p-4';

type Props = {
  children: ReactNode;
  /** Rend la carte tappable (ajoute un feedback au press). */
  onPress?: PressableProps['onPress'];
  className?: string;
};

/** Conteneur surface du design system. UI pure. */
export function Card({ children, onPress, className }: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(BASE, 'active:opacity-70', className)}
        accessibilityRole="button">
        {children}
      </Pressable>
    );
  }

  return <View className={cn(BASE, className)}>{children}</View>;
}
