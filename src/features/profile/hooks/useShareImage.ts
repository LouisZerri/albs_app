import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import type { HostInstance } from 'react-native';
import { captureRef } from 'react-native-view-shot';

/**
 * Transforme une vue en image PNG et ouvre la feuille de partage du téléphone (messages, réseaux,
 * enregistrement dans les photos…). `ref` est à poser sur la vue à capturer.
 */
export function useShareImage() {
  const ref = useRef<HostInstance>(null);
  const [sharing, setSharing] = useState(false);

  /** Lève une erreur si la capture ou le partage échoue (à signaler à l'utilisateur). */
  const share = async () => {
    setSharing(true);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Partage indisponible sur cet appareil.');
      }
      const uri = await captureRef(ref, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
    } finally {
      setSharing(false);
    }
  };

  return { ref, share, sharing };
}
