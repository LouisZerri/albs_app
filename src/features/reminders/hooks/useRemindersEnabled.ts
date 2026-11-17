import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

// Préférence mémorisée sur l'appareil, comme le thème et la langue. Désactivé par défaut :
// on ne demande l'autorisation de notifier que lorsque l'utilisateur active les rappels.
const STORAGE_KEY = 'albs.reminders';

let enabled = false;
const listeners = new Set<() => void>();
const publish = (next: boolean) => {
  enabled = next;
  listeners.forEach((listener) => listener());
};

// Lu une fois au chargement du module ; les écrans se mettent à jour quand la valeur arrive.
SecureStore.getItemAsync(STORAGE_KEY)
  .then((saved) => publish(saved === '1'))
  .catch(() => undefined);

/** Les rappels sont-ils activés ? + de quoi changer ce réglage (mémorisé). */
export function useRemindersEnabled() {
  const value = useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => enabled,
  );

  const setEnabled = (next: boolean) => {
    publish(next);
    void SecureStore.setItemAsync(STORAGE_KEY, next ? '1' : '0');
  };

  return { enabled: value, setEnabled };
}
