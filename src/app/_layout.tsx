import '@/global.css';

import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat/500Medium';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat/600SemiBold';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import { Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat/800ExtraBold';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, ME_QUERY_KEY, useAuth } from '@/features/auth/store';
import { BadgeCelebrationProvider } from '@/features/badges';
import { registerToggleFavoriteMutation } from '@/features/bonplans/hooks';
import { registerToggleStationMutation } from '@/features/network/hooks';
import { useRestoreLanguage } from '@/i18n';
import { watchAppFocus } from '@/shared/lib/appFocus';
import {
  ApiError,
  persistOptions,
  queryClient,
  resumePendingMutations,
  watchNetworkStatus,
} from '@/shared/lib';
import { useRestoreThemeMode, useThemeColors, useThemeMode } from '@/shared/theme';
import { ErrorState, Screen, ToastProvider } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();

// Hors-ligne : suivi du réseau + déclaration des actions rejouables après un redémarrage.
watchNetworkStatus();
watchAppFocus();
registerToggleStationMutation(queryClient);
registerToggleFavoriteMutation(queryClient);

export default function RootLayout() {
  useRestoreThemeMode();
  const languageReady = useRestoreLanguage();
  const { mode } = useThemeMode();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  if (!fontsLoaded || !languageReady) {
    return null; // le splash reste affiché tant que les polices et la langue ne sont pas prêtes
  }

  return (
    // Le cache est relu depuis le téléphone au lancement, puis les cochages en attente repartent.
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      onSuccess={() => resumePendingMutations()}
    >
      {/* Heure et batterie lisibles : claires sur fond sombre, sombres sur fond clair. */}
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AuthProvider>
        <ToastProvider>
          <BadgeCelebrationProvider>
            <RootNavigator />
          </BadgeCelebrationProvider>
        </ToastProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

/** Redirige entre (auth), l'onboarding et (tabs) selon l'état de session. */
function RootNavigator() {
  const colors = useThemeColors();
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
    if (status === 'loading' || status === 'offline') return;

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

  // Compte mémorisé mais profil jamais chargé, et pas de réseau : on attend (la requête repart
  // toute seule au retour de la connexion).
  if (status === 'offline') {
    return (
      <Screen>
        <ErrorState
          error={new ApiError('', 0)}
          message=""
          onRetry={() => void queryClient.refetchQueries({ queryKey: ME_QUERY_KEY })}
        />
      </Screen>
    );
  }

  // Fond des écrans = fond du thème : pas d'éclair blanc pendant les transitions en mode sombre.
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
  );
}
