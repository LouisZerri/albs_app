import { View } from 'react-native';

import { colors } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

type Props = {
  /** Pourcentage 0–100. */
  percent: number;
  /** Couleur de remplissage (défaut : accent). */
  color?: string;
  className?: string;
};

/** Barre de progression horizontale. UI pure. */
export function ProgressBar({ percent, color, className }: Props) {
  const width = `${Math.max(0, Math.min(100, percent))}%` as const;

  return (
    <View className={cn('h-2 overflow-hidden rounded-pill bg-hair', className)}>
      <View className="h-full rounded-pill" style={{ width, backgroundColor: color ?? colors.accent }} />
    </View>
  );
}
