import '@/global.css';

import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat/500Medium';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat/600SemiBold';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import { Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat/800ExtraBold';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/features/auth/store';
import { BadgeCelebrationProvider } from '@/features/badges';
import { queryClient } from '@/shared/lib';
import { ToastProvider } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null; // le splash reste affiché tant que les polices ne sont pas prêtes
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BadgeCelebrationProvider>
            <RootNavigator />
          </BadgeCelebrationProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/** Redirige entre (auth), l'onboarding et (tabs) selon l'état de session. */
function RootNavigator() {
  const { status, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Masque le splash dès que la session est connue (évite un flash d'écran).
  useEffect(() => {
    if (status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'loading') return;

    const inAuthGroup = segments[0] === '(auth)';
    const onOnboarding = segments[0] === 'onboarding';

    if (status === 'unauthenticated') {
      if (!inAuthGroup) router.replace('/login');
      return;
    }

    // Authentifié : onboarding tant qu'il n'est pas terminé, sinon l'app.
    const onboardingDone = Boolean(user?.onboardingCompletedAt);
    if (!onboardingDone) {
      if (!onOnboarding) router.replace('/onboarding');
    } else if (inAuthGroup || onOnboarding) {
      router.replace('/');
    }
  }, [status, user, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
