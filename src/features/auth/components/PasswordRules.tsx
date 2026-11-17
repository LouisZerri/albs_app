import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import { passwordRules } from '../lib/passwordRules';

/** Affiche en direct quelles règles de mot de passe sont respectées. */
export function PasswordRules({ value }: { value: string }) {
  const colors = useThemeColors();
  const { t } = useTranslation('auth');
  return (
    <View className="gap-1.5">
      {passwordRules.map((rule) => {
        const ok = rule.test(value);
        return (
          <View key={rule.key} className="flex-row items-center gap-2">
            <Ionicons
              name={ok ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={ok ? colors.visited : colors.muted}
            />
            <Text variant="muted" color={ok ? 'visited' : undefined}>
              {t(`passwordRules.${rule.key}`)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
