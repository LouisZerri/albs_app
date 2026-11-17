import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { ScreenHeader } from './ScreenHeader';
import { Text } from './Text';

type Props = {
  title: string;
  /** Ligne de détail sous le titre. */
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
};

/**
 * Coquille d'un sous-écran défilant (formulaire, détail) : en-tête avec retour + contenu qui
 * défile, clavier non gênant. Même présentation pour tous les sous-écrans de l'app. UI pure.
 */
export function SubScreen({ title, subtitle, onBack, children }: Props) {
  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader title={title} onBack={onBack}>
        {subtitle ? <Text variant="muted">{subtitle}</Text> : null}
      </ScreenHeader>

      <ScrollView
        contentContainerClassName="grow px-5 pb-10 pt-2"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
