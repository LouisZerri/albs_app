import type { ReactNode } from 'react';
import { Image, ScrollView, View } from 'react-native';

import { Screen, Text } from '@/shared/ui';

// Logo « hub coloré » (même image que l'icône d'app).
const LOGO = require('../../../../assets/images/icon.png');

// Centre le bloc verticalement tout en restant scrollable quand le clavier réduit l'espace.
const CONTENT_STYLE = { flexGrow: 1, justifyContent: 'center' } as const;

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Coquille commune aux écrans d'auth : logo, titres centrés, clavier non gênant. */
export function AuthScreenLayout({ title, subtitle, children }: Props) {
  return (
    <Screen padded={false}>
      <ScrollView
        className="px-5"
        contentContainerStyle={CONTENT_STYLE}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-9 py-10">
          <View className="items-center gap-4">
            <Image source={LOGO} className="h-20 w-20 rounded-card" resizeMode="cover" />
            <View className="items-center gap-1.5">
              <Text variant="title" className="text-center">
                {title}
              </Text>
              {subtitle ? (
                <Text variant="muted" className="text-center">
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          {children}
        </View>
      </ScrollView>
    </Screen>
  );
}
