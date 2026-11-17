import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

type Props = { onOpenHistory: () => void; onOpenShare: () => void };

/** Raccourcis du profil : historique des visites et carte-souvenir à partager. UI pure. */
export function ProfileShortcuts({ onOpenHistory, onOpenShare }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const items: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }[] = [
    { label: t('shortcuts.history'), icon: 'time-outline', onPress: onOpenHistory },
    { label: t('shortcuts.share'), icon: 'share-outline', onPress: onOpenShare },
  ];

  return (
    <View className="flex-row gap-3">
      {items.map((item) => (
        <Card
          key={item.label}
          onPress={item.onPress}
          className="flex-1 flex-row items-center gap-2.5 p-3.5"
        >
          <Ionicons name={item.icon} size={20} color={colors.accent} />
          <Text className="flex-1" numberOfLines={1}>
            {item.label}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Card>
      ))}
    </View>
  );
}
