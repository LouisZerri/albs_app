import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useSyncStatus } from '@/shared/hooks/useSyncStatus';
import { useThemeColors } from '@/shared/theme';

import { Text } from './Text';

/**
 * Bandeau d'état de la synchronisation, intégré à la mise en page (il ne recouvre rien).
 * - Sans réseau : « Hors ligne », avec le nombre de changements gardés en attente (messages courts,
 *   pour tenir sur une ligne même sur un petit écran).
 * - Réseau revenu, envoi en cours : « Envoi de N changements… » — seulement si l'envoi dure : avec du
 *   réseau un cochage part en une fraction de seconde, et l'afficher ferait clignoter le bandeau.
 * - Sinon : rien.
 */
/** Un envoi plus court que ça ne s'affiche pas. */
const SENDING_NOTICE_DELAY_MS = 1500;

export function OfflineNotice() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { online, pending } = useSyncStatus();

  const sendingForLong = useLasting(online && pending > 0, SENDING_NOTICE_DELAY_MS);

  if (online && !sendingForLong) return null;

  // « changements » : la file contient des cochages, mais aussi des favoris.
  const many = pending > 1;
  const message = online
    ? t(many ? 'offline.sendingMany' : 'offline.sendingOne', { count: pending })
    : pending > 0
      ? t(many ? 'offline.waitingMany' : 'offline.waitingOne', { count: pending })
      : t('offline.kept');

  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-center justify-center gap-2 bg-passed/20 px-4 py-1.5"
    >
      <Ionicons
        name={online ? 'cloud-upload-outline' : 'cloud-offline-outline'}
        size={15}
        color={colors.ink}
      />
      {/* Pas de troncature : sur un petit écran le message passe sur deux lignes. */}
      <Text variant="muted" color="ink" className="shrink text-center" style={{ fontSize: 13 }}>
        {message}
      </Text>
    </View>
  );
}

/** Vrai seulement quand `active` l'est resté sans interruption pendant `delayMs`. */
function useLasting(active: boolean, delayMs: number): boolean {
  const [lasting, setLasting] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setLasting(true), delayMs);
    return () => {
      clearTimeout(timer);
      setLasting(false);
    };
  }, [active, delayMs]);

  return active && lasting;
}
