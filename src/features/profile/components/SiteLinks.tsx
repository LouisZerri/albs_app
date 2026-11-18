import { Ionicons } from '@expo/vector-icons';
import { Linking, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Card, Text, useToast } from '@/shared/ui';

/**
 * Liens vers le site web : le forum (qui n'existe pas dans l'app) et les conditions d'utilisation.
 * Ils ouvrent le navigateur, ce que l'icône et la mention « sur le site » annoncent.
 */
export function SiteLinks() {
  const colors = useThemeColors();
  const toast = useToast();
  const { t } = useTranslation('profile');

  const links: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; url: string }[] =
    [
      {
        key: 'forum',
        icon: 'chatbubbles-outline',
        label: t('site.forum'),
        url: t('site.forumUrl'),
      },
      {
        key: 'terms',
        icon: 'document-text-outline',
        label: t('site.terms'),
        url: t('site.termsUrl'),
      },
    ];

  const open = (url: string) =>
    Linking.openURL(url).catch(() => toast.show(t('site.openFailed'), 'error'));

  return (
    <View className="gap-3">
      {links.map((link) => (
        <Card
          key={link.key}
          onPress={() => void open(link.url)}
          className="flex-row items-center gap-3"
        >
          <Ionicons name={link.icon} size={20} color={colors.ink} />
          <View className="flex-1 gap-0.5">
            <Text>{link.label}</Text>
            <Text variant="muted" className="text-sm">
              {t('site.onWebsite')}
            </Text>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.muted} />
        </Card>
      ))}
    </View>
  );
}
