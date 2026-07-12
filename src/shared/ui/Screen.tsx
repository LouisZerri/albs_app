import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/shared/utils/cn';

type ScreenProps = {
  children: ReactNode;
  /** Contenu scrollable (défaut: false). */
  scroll?: boolean;
  /** Padding horizontal standard (défaut: true). */
  padded?: boolean;
  className?: string;
};

/** Conteneur d'écran : safe area + fond de l'app. UI pure. */
export function Screen({ children, scroll = false, padded = true, className }: ScreenProps) {
  const content = cn('flex-1', padded && 'px-5', className);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView className={content} contentContainerClassName="grow" keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View className={content}>{children}</View>
      )}
    </SafeAreaView>
  );
}
