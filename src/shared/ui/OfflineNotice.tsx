import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useSyncStatus } from '@/shared/hooks/useSyncStatus';
import { useThemeColors } from '@/shared/theme';

import { Text } from './Text';

/**
 * Bandeau d'état de la synchronisation, intégré à la mise en page (il ne recouvre rien).
 * - Sans réseau : « Hors ligne », avec le nombre de cochages gardés en attente.
 * - Réseau revenu, envoi en cours : « Envoi de N cochages… ».
 * - Sinon : rien.
 */
export function OfflineNotice() {
  const colors = useThemeColors();
  const { online, pending } = useSyncStatus();

  if (online && pending === 0) return null;

  const waiting = pending > 1 ? `${pending} cochages` : '1 cochage';
  const message = online
    ? `Envoi de ${waiting}…`
    : pending > 0
      ? `Hors ligne · ${waiting} en attente`
      : 'Hors ligne · tes cochages seront envoyés au retour du réseau';

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
      <Text variant="muted" color="ink" numberOfLines={1} style={{ fontSize: 13 }}>
        {message}
      </Text>
    </View>
  );
}
