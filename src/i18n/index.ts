import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';

import { i18n, isLanguage, type Language } from './instance';

export { dateLocale, i18n, isPlural, LANGUAGES, type Language } from './instance';
export { useTranslation } from 'react-i18next';

// Branche l'instance sur React (les composants se redessinent au changement de langue).
initReactI18next.init(i18n);

// Préférence mémorisée sur l'appareil, comme le thème.
const STORAGE_KEY = 'albs.lang';

/** Langue active + changement de langue (mémorisé). Sans choix explicite, l'app suit le téléphone. */
export function useLanguage() {
  const { i18n: active } = useTranslation();
  const language: Language = isLanguage(active.language) ? active.language : 'fr';

  const setLanguage = (next: Language) => {
    void active.changeLanguage(next);
    void SecureStore.setItemAsync(STORAGE_KEY, next);
  };

  return { language, setLanguage };
}

/**
 * Au lancement : réapplique la langue choisie par l'utilisateur, s'il en a choisi une.
 * Renvoie `true` une fois la langue connue — à attendre avant d'afficher l'app, pour ne pas
 * montrer un écran dans une langue puis le basculer dans l'autre.
 */
export function useRestoreLanguage(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((saved) => (isLanguage(saved) ? i18n.changeLanguage(saved) : undefined))
      .catch(() => undefined) // préférence illisible → on garde la langue du téléphone
      .finally(() => setReady(true));
  }, []);

  return ready;
}
