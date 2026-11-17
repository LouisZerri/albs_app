import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { cn } from '@/shared/utils/cn';

/** Bloc gris qui « respire » : tient la place d'un contenu en cours de chargement. UI pure. */
export function Skeleton({ className }: { className?: string }) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View className={cn('rounded-md bg-hair', className)} style={{ opacity }} />;
}

/**
 * Liste de cartes fantômes (pastille + deux lignes de texte) : remplace la roue de chargement
 * des écrans en liste, pour que la page ait déjà sa forme pendant le chargement.
 */
export function SkeletonList({ count = 6, className }: { count?: number; className?: string }) {
  const { t } = useTranslation();
  return (
    <View
      className={cn('gap-3 px-5', className)}
      accessibilityRole="progressbar"
      accessibilityLabel={t('a11y.loading')}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className="flex-row items-center gap-3 rounded-card border border-hair bg-surface p-3"
        >
          <Skeleton className="h-9 w-9 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </View>
        </View>
      ))}
    </View>
  );
}
