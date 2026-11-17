import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { isPlural, useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import { useWarnings } from '../hooks';

/** Bandeau affiché quand le compte a des avertissements non lus. */
export function WarningsBanner() {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const router = useRouter();
  const { data } = useWarnings();

  const unread = (data ?? []).filter((w) => !w.acknowledgedAt).length;
  if (unread === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/profile/warnings')}
      className="flex-row items-center gap-3 rounded-card border border-danger/40 bg-danger/10 p-3.5 active:opacity-80"
    >
      <Ionicons name="warning" size={22} color={colors.danger} />
      <View className="flex-1">
        <Text variant="subtitle" className="text-sm">
          {t(isPlural(unread) ? 'warningsBanner.unreadMany' : 'warningsBanner.unreadOne', {
            count: unread,
          })}
        </Text>
        <Text variant="muted" className="text-xs">
          {t('warningsBanner.hint')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
