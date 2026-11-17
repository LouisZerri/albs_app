import { focusManager } from '@tanstack/react-query';
import { AppState } from 'react-native';

/**
 * Signale à TanStack Query quand l'app revient au premier plan : les données périmées des écrans
 * affichés sont alors rafraîchies. Sans ça, un onglet resté ouvert garde ses données jusqu'au
 * redémarrage de l'app (React Native n'a pas d'équivalent au « focus » d'une fenêtre de navigateur).
 * À appeler une fois, au démarrage.
 */
export function watchAppFocus(): void {
  AppState.addEventListener('change', (state) => focusManager.setFocused(state === 'active'));
}
