import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';
import { Button, Text } from '@/shared/ui';

const GRADIENT = ['#7C3AED', '#5B21B6'] as const;

/** Célébration de fin d'onboarding : confettis + révélation du premier badge. */
export function OnboardingCelebration({ onEnter }: { onEnter: () => void }) {
  const { width } = useWindowDimensions();

  return (
    <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <ConfettiCannon
        count={160}
        origin={{ x: width / 2, y: -20 }}
        autoStart
        fadeOut
        explosionSpeed={350}
        fallSpeed={2800}
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center gap-6 px-8">
          <View className="h-28 w-28 items-center justify-center rounded-full bg-white/15">
            <Ionicons name="medal" size={60} color={colors.white} />
          </View>
          <View className="items-center gap-3">
            <Text variant="title" color="white" className="text-center">
              Bienvenue à bord !
            </Text>
            <Text variant="body" color="white" className="text-center" style={{ opacity: 0.85 }}>
              Tu viens de débloquer ton premier badge. Le réseau t’attend 🚇
            </Text>
          </View>
        </View>

        <View className="px-6 pb-4">
          <Button label="Entrer dans l’app" variant="inverse" onPress={onEnter} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
