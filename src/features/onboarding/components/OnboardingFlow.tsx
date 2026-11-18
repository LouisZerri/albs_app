import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  ScrollView,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCompleteOnboarding } from '@/features/auth/hooks';
import { ME_QUERY_KEY } from '@/features/auth/store';
import type { User } from '@/features/auth/types';
import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Button, Text, useToast } from '@/shared/ui';

import { ONBOARDING_STEPS } from '../content';
import { OnboardingCelebration } from './OnboardingCelebration';

const GRADIENT = ['#7C3AED', '#5B21B6'] as const;

/** Onboarding bloquant en 3 étapes swipeables, suivi d'une célébration (confettis). */
export function OnboardingFlow() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation('onboarding');
  const { mutate, isPending } = useCompleteOnboarding();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const completedUser = useRef<User | null>(null);
  const [index, setIndex] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const isLast = index === ONBOARDING_STEPS.length - 1;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const next = () => {
    if (!isLast) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
      // L'étape avance tout de suite : la fin d'un défilement lancé par le code n'est pas
      // signalée sur toutes les plateformes, et l'on resterait bloqué sur « Continuer ».
      setIndex(index + 1);
      return;
    }
    mutate(undefined, {
      onSuccess: (user) => {
        completedUser.current = user;
        setCelebrating(true);
      },
      onError: () => toast.show(t('error'), 'error'),
    });
  };

  // Applique l'utilisateur à jour au cache → le garde de session bascule vers l'app.
  const enterApp = () => {
    if (completedUser.current) {
      queryClient.setQueryData(ME_QUERY_KEY, completedUser.current);
    }
  };

  if (celebrating) {
    return <OnboardingCelebration onEnter={enterApp} />;
  }

  return (
    <LinearGradient
      colors={GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          className="flex-1"
        >
          {ONBOARDING_STEPS.map((step) => (
            <View
              key={step.key}
              style={{ width }}
              className="flex-1 items-center justify-center px-8"
            >
              <View className="items-center gap-6">
                <View className="h-24 w-24 items-center justify-center rounded-full bg-white/15">
                  <Ionicons name={step.icon} size={46} color={colors.white} />
                </View>
                <View className="items-center gap-3">
                  <Text variant="title" color="white" className="text-center">
                    {t(`steps.${step.key}.title`)}
                  </Text>
                  <Text
                    variant="body"
                    color="white"
                    className="text-center"
                    style={{ opacity: 0.85 }}
                  >
                    {t(`steps.${step.key}.body`)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="gap-6 px-6 pb-4">
          <View className="flex-row justify-center gap-2.5">
            {ONBOARDING_STEPS.map((s, i) => (
              <View
                key={s.key}
                className={
                  i === index
                    ? 'h-3 w-3 rounded-full bg-white'
                    : 'h-2.5 w-2.5 rounded-full bg-white/40'
                }
              />
            ))}
          </View>

          <Button
            label={isLast ? t('commit') : t('continue')}
            variant="inverse"
            onPress={next}
            loading={isLast && isPending}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
