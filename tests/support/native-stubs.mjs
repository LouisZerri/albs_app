// Bouchons des modules natifs pour les tests Node. Volontairement minimaux.
const memory = new Map();

// expo-secure-store
export const getItemAsync = async (key) => memory.get(key) ?? null;
export const setItemAsync = async (key, value) => void memory.set(key, value);
export const deleteItemAsync = async (key) => void memory.delete(key);

// expo-localization
export const getLocales = () => [{ languageCode: 'fr' }];

// expo-file-system
export class File {
  constructor(...parts) {
    this.key = parts.map(String).join('/');
  }
  get exists() {
    return memory.has(this.key);
  }
  async text() {
    return memory.get(this.key);
  }
  async write(content) {
    memory.set(this.key, content);
  }
  delete() {
    memory.delete(this.key);
  }
}
export const Paths = { document: 'document' };

// @react-native-community/netinfo
export default { addEventListener: () => () => undefined };

// react-native
export const Platform = { OS: 'ios' };
export const Linking = { openURL: async () => undefined };
