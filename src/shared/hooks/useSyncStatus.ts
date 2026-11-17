import { onlineManager, useIsMutating } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

/**
 * État de la synchronisation : le téléphone a-t-il du réseau, et combien d'actions (cochages…)
 * attendent encore d'être envoyées au serveur.
 */
export function useSyncStatus() {
  const online = useSyncExternalStore(
    (onChange) => onlineManager.subscribe(onChange),
    () => onlineManager.isOnline(),
  );
  // « pending » = pas encore confirmée par le serveur (en pause faute de réseau, ou en cours d'envoi).
  const pending = useIsMutating();

  return { online, pending };
}
