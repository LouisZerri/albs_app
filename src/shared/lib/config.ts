/**
 * Config runtime, lue depuis les variables d'env Expo (`EXPO_PUBLIC_*`).
 * Aucune valeur sensible ni URL en dur ici — tout vient du `.env`.
 */

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiBaseUrl && __DEV__) {
  console.warn(
    '[config] EXPO_PUBLIC_API_URL manquant — vérifie le .env (et relance `expo start -c`).',
  );
}

export const config = {
  apiBaseUrl: apiBaseUrl ?? '',
} as const;
