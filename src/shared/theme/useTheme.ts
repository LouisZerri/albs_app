import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect } from 'react';

import { palettes, type Palette } from './tokens';

export type ThemeMode = 'light' | 'dark';

// Préférence mémorisée sur l'appareil. (Trousseau sécurisé = seul stockage déjà présent dans l'app.)
const STORAGE_KEY = 'albs.theme';

/**
 * Couleurs du thème actif, pour le code qui ne passe pas par les classes (icônes, cartes
 * géographiques, styles calculés). Les classes Tailwind, elles, suivent le thème toutes seules.
 */
export function useThemeColors(): Palette {
  const { colorScheme } = useColorScheme();

  return palettes[colorScheme === 'dark' ? 'dark' : 'light'];
}

/** Thème actif + bascule clair/sombre (mémorisée). Sans choix explicite, l'app suit le système. */
export function useThemeMode() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const mode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';

  const setMode = useCallback(
    (next: ThemeMode) => {
      setColorScheme(next);
      void SecureStore.setItemAsync(STORAGE_KEY, next);
    },
    [setColorScheme],
  );

  return { mode, setMode };
}

/** Au lancement de l'app : réapplique le thème choisi par l'utilisateur, s'il en a choisi un. */
export function useRestoreThemeMode() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setColorScheme(saved);
      })
      .catch(() => undefined); // préférence illisible → on garde le thème du système
  }, [setColorScheme]);
}
