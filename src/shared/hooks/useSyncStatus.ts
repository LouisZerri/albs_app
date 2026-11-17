import { onlineManager, useIsMutating } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

import { isQueuedOffline } from '@/shared/lib';

/**
 * État de la synchronisation : le téléphone a-t-il du réseau, et combien d'actions de la file
 * hors ligne (cochages, favoris) attendent encore d'être envoyées au serveur.
 */
export function useSyncStatus() {
  const online = useSyncExternalStore(
    (onChange) => onlineManager.subscribe(onChange),
    () => onlineManager.isOnline(),
  );
  // « pending » = pas encore confirmée par le serveur (en pause faute de réseau, ou en cours d'envoi).
  const pending = useIsMutating({ predicate: isQueuedOffline });

  return { online, pending };
}
