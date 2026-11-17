import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';

import { en } from './locales/en';
import { fr } from './locales/fr';

export const LANGUAGES = ['fr', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);

/** Langue du téléphone si l'app la parle ; sinon l'anglais (un visiteur étranger le lit plus sûrement). */
export function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;

  return isLanguage(code) ? code : 'en';
}

/**
 * L'instance de traduction, utilisable hors de React (`i18n.t('common:errors.network')`).
 * Les deux langues sont embarquées dans l'app : aucune traduction ne dépend du réseau.
 * Dans les composants, passer par `useTranslation` (voir `./index.ts`).
 */
export const i18n = createInstance();

void i18n.init({
  resources: { fr, en },
  lng: deviceLanguage(),
  fallbackLng: 'fr',
  defaultNS: 'common',
  initAsync: false, // ressources locales : prêt tout de suite, pas d'écran sans texte
  interpolation: { escapeValue: false }, // React Native n'interprète pas le HTML
});
