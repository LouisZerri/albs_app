import { useRouter, type Href } from 'expo-router';
import { useEffect } from 'react';

import { useNetworkStats } from '@/features/network/hooks';
import { isPlural, useLanguage, useTranslation } from '@/i18n';

import { onReminderOpened, replaceReminders, type ScheduledReminder } from '../lib/notifier';
import { planReminders } from '../lib/planReminders';
import { useRemindersEnabled } from './useRemindersEnabled';

/**
 * Tient les rappels du téléphone à jour : à chaque changement de progression (ou de langue), ils
 * sont recalculés et reprogrammés. Ouvre aussi le bon écran quand on touche un rappel.
 * À monter une fois, dans l'app connectée.
 */
export function useReminderSync(): void {
  const router = useRouter();
  const { t } = useTranslation('reminders');
  const { language } = useLanguage();
  const { enabled } = useRemindersEnabled();
  const stats = useNetworkStats();

  // Une clé stable : on ne reprogramme que si quelque chose a réellement changé.
  const challenges = stats.data?.challenges;
  const lines = stats.data?.lines;
  const signature = JSON.stringify(challenges?.map((c) => [c.key, c.current, c.target, c.lineId]));

  useEffect(() => {
    // Rappels coupés : rien à faire ici (ils sont annulés au moment où on les coupe), et on ne
    // charge même pas le module de notifications.
    if (!enabled || !challenges || !lines) return;

    const scheduled = planReminders(challenges, lines, new Date()).map(
      (reminder): ScheduledReminder => {
        const suffix = isPlural(reminder.remaining) ? 'Many' : 'One';
        return reminder.kind === 'week'
          ? {
              at: reminder.at,
              title: t('week.title'),
              body: t(`week.body${suffix}`, { count: reminder.remaining }),
              url: '/',
            }
          : {
              at: reminder.at,
              title: t('line.title', { number: reminder.lineNumber }),
              body: t(`line.body${suffix}`, { count: reminder.remaining }),
              url: `/line/${reminder.lineId}`,
            };
      },
    );
    void replaceReminders(scheduled);
    // `signature` résume `challenges` ; `lines` (numéros des lignes) ne change jamais.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, signature, language]);

  useEffect(
    () => (enabled ? onReminderOpened((url) => router.push(url as Href)) : undefined),
    [enabled, router],
  );
}
