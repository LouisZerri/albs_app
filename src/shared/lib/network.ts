import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Branche l'état du réseau du téléphone sur TanStack Query. Hors ligne, les requêtes se mettent
 * en pause (on garde les données en cache) et les cochages attendent ; au retour du réseau, tout
 * repart tout seul. À appeler une fois, au démarrage de l'app.
 */
export function watchNetworkStatus(): void {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      // `isInternetReachable` vaut null tant que le test n'est pas fait : on ne s'y fie que s'il dit non.
      setOnline(Boolean(state.isConnected) && state.isInternetReachable !== false);
    }),
  );
}
