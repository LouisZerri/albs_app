import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

import { deleteAccount } from '@/features/auth/api';
import { useAuth } from '@/features/auth/store';
import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text, useToast } from '@/shared/ui';

/** Zone « danger » : suppression (anonymisation) du compte, avec confirmation. */
export function DangerZone() {
  const colors = useThemeColors();
  const { t } = useTranslation(['profile', 'common']);
  const { signOut } = useAuth();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  const confirm = () => {
    Alert.alert(t('danger.confirmTitle'), t('danger.confirmMessage'), [
      { text: t('common:actions.cancel'), style: 'cancel' },
      { text: t('danger.confirmDelete'), style: 'destructive', onPress: run },
    ]);
  };

  const run = async () => {
    setPending(true);
    try {
      await deleteAccount();
      await signOut();
    } catch {
      toast.show(t('danger.failed'), 'error');
      setPending(false);
    }
  };

  return (
    <View className="mt-2 gap-2 rounded-card border border-danger/30 bg-danger/5 p-4">
      <Text variant="subtitle" color="danger" className="text-sm">
        {t('danger.title')}
      </Text>
      <Text variant="muted" className="text-xs">
        {t('danger.description')}
      </Text>
      <Pressable
        onPress={confirm}
        disabled={pending}
        className="mt-1 flex-row items-center justify-center rounded-card border border-danger/40 py-3 active:opacity-70"
      >
        {pending ? (
          <ActivityIndicator color={colors.danger} />
        ) : (
          <Text variant="subtitle" color="danger" className="text-sm">
            {t('danger.deleteAccount')}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
