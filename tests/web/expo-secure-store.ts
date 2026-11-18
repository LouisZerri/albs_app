/**
 * Remplaçant d'`expo-secure-store` pour le navigateur (essais sur ordinateur) : le trousseau
 * sécurisé du téléphone n'existe pas sur le web, on range dans le stockage de la page.
 * N'est jamais utilisé sur téléphone.
 */
const PREFIX = 'albs-test:';

export const getItemAsync = async (key: string): Promise<string | null> =>
  window.localStorage.getItem(PREFIX + key);
export const setItemAsync = async (key: string, value: string): Promise<void> =>
  window.localStorage.setItem(PREFIX + key, value);
export const deleteItemAsync = async (key: string): Promise<void> =>
  window.localStorage.removeItem(PREFIX + key);
