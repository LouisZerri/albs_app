import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { colors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import { passwordRules } from '../lib/passwordRules';

/** Affiche en direct quelles règles de mot de passe sont respectées. */
export function PasswordRules({ value }: { value: string }) {
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
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
