import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

/** Bandeau d'alerte affiché quand l'adresse email n'est pas vérifiée. */
export function EmailVerificationBanner() {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/profile/verify-email')}
      className="flex-row items-center gap-3 rounded-card border border-passed/40 bg-passed/10 p-3.5 active:opacity-80"
    >
      <Ionicons name="alert-circle" size={22} color={colors.passed} />
      <View className="flex-1">
        <Text variant="subtitle" className="text-sm">
          {t('emailBanner.title')}
        </Text>
        <Text variant="muted" className="text-xs">
          {t('emailBanner.hint')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
