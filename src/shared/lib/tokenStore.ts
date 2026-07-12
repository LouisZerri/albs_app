import * as SecureStore from 'expo-secure-store';

// Clés du trousseau sécurisé (Keychain iOS / Keystore Android).
const ACCESS_KEY = 'albs.accessToken';
const REFRESH_KEY = 'albs.refreshToken';

/** Accès au JWT et au refresh token, persistés dans le stockage sécurisé du système. */
export const tokenStore = {
  getAccess: () => SecureStore.getItemAsync(ACCESS_KEY),
  getRefresh: () => SecureStore.getItemAsync(REFRESH_KEY),

  async save(accessToken: string, refreshToken: string) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
    ]);
  },

  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
  },
};
