import { Ionicons } from '@expo/vector-icons';
import { Linking, Switch, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Card, Text, useToast } from '@/shared/ui';

import { useRemindersEnabled } from '../hooks';
import { replaceReminders, requestPermission } from '../lib/notifier';

/** Réglage « Rappels » : active ou coupe les notifications de défi et de ligne presque finie. */
export function RemindersCard() {
  const colors = useThemeColors();
  const toast = useToast();
  const { t } = useTranslation('reminders');
  const { enabled, setEnabled } = useRemindersEnabled();

  const toggle = async (next: boolean) => {
    if (!next) {
      setEnabled(false);
      void replaceReminders([]); // annule ceux déjà programmés
      return;
    }
    // L'autorisation du système n'est demandée qu'ici, au moment où l'on active les rappels.
    if (await requestPermission()) {
      setEnabled(true);
      toast.show(t('settings.enabled'), 'success');
    } else {
      toast.show(t('settings.denied'), 'error');
      void Linking.openSettings().catch(() => undefined);
    }
  };

  return (
    <Card className="flex-row items-center gap-3">
      <Ionicons name="notifications-outline" size={20} color={colors.ink} />
      <View className="flex-1 gap-0.5">
        <Text>{t('settings.title')}</Text>
        <Text variant="muted" className="text-sm">
          {t('settings.hint')}
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={(next) => void toggle(next)}
        trackColor={{ true: colors.accent, false: colors.hair }}
        accessibilityLabel={t('settings.title')}
      />
    </Card>
  );
}
