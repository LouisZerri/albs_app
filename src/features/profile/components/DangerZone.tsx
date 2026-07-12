import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

import { deleteAccount } from '@/features/auth/api';
import { useAuth } from '@/features/auth/store';
import { colors } from '@/shared/theme';
import { Text, useToast } from '@/shared/ui';

/** Zone « danger » : suppression (anonymisation) du compte, avec confirmation. */
export function DangerZone() {
  const { signOut } = useAuth();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  const confirm = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est définitive. Tes données personnelles seront effacées et tu seras déconnecté. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: run },
      ],
    );
  };

  const run = async () => {
    setPending(true);
    try {
      await deleteAccount();
      await signOut();
    } catch {
      toast.show('Échec de la suppression. Réessaie.', 'error');
      setPending(false);
    }
  };

  return (
    <View className="mt-2 gap-2 rounded-card border border-danger/30 bg-danger/5 p-4">
      <Text variant="subtitle" color="danger" className="text-sm">
        Zone dangereuse
      </Text>
      <Text variant="muted" className="text-xs">
        La suppression efface tes données personnelles (anonymisation). Ton contenu communautaire
        est conservé sous un compte anonyme.
      </Text>
      <Pressable
        onPress={confirm}
        disabled={pending}
        className="mt-1 flex-row items-center justify-center rounded-card border border-danger/40 py-3 active:opacity-70">
        {pending ? (
          <ActivityIndicator color={colors.danger} />
        ) : (
          <Text variant="subtitle" color="danger" className="text-sm">
            Supprimer mon compte
          </Text>
        )}
      </Pressable>
    </View>
  );
}
