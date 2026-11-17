import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '@/shared/theme';

import { OfflineNotice } from './OfflineNotice';
import { Text } from './Text';

type Props = {
  title: string;
  onBack: () => void;
  /** Contenu sous le titre (sous-titre, pastilles…). */
  children?: ReactNode;
};

/** En-tête compact d'un sous-écran : bouton retour + titre (+ ligne de détail). UI pure. */
export function ScreenHeader({ title, onBack, children }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View className="border-b border-hair bg-surface" style={{ paddingTop: insets.top }}>
      <OfflineNotice />
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-1.5">
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          className="h-9 w-7 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>

        <View className="flex-1 gap-1">
          <Text variant="subtitle" numberOfLines={1}>
            {title}
          </Text>
          {children}
        </View>
      </View>
    </View>
  );
}
