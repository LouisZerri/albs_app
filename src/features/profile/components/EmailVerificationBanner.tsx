import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { colors } from '@/shared/theme';
import { Text } from '@/shared/ui';

/** Bandeau d'alerte affiché quand l'adresse email n'est pas vérifiée. */
export function EmailVerificationBanner() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/profile/verify-email')}
      className="flex-row items-center gap-3 rounded-card border border-passed/40 bg-passed/10 p-3.5 active:opacity-80">
      <Ionicons name="alert-circle" size={22} color={colors.passed} />
      <View className="flex-1">
        <Text variant="subtitle" className="text-sm">
          Adresse email non vérifiée
        </Text>
        <Text variant="muted" className="text-xs">
          Touche pour confirmer ton adresse.
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
