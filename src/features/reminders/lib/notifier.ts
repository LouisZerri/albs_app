import { Platform } from 'react-native';

/** Une notification locale à programmer : textes déjà traduits + écran à ouvrir au tap. */
export type ScheduledReminder = { at: Date; title: string; body: string; url: string };

const CHANNEL_ID = 'reminders';

/**
 * Accès aux notifications du téléphone. Le module natif est chargé À LA DEMANDE et chaque appel
 * est protégé : s'il est indisponible (certaines versions d'Expo Go sur Android), les rappels
 * sont simplement inactifs, l'app n'en souffre pas.
 */
const load = () => import('expo-notifications');

/** L'utilisateur a-t-il déjà autorisé les notifications ? */
export async function hasPermission(): Promise<boolean> {
  try {
    return (await (await load()).getPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/** Demande l'autorisation (la fenêtre du système n'apparaît que la première fois). */
export async function requestPermission(): Promise<boolean> {
  try {
    return (await (await load()).requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/** Remplace tous les rappels programmés par ceux-ci (liste vide = plus aucun rappel). */
export async function replaceReminders(reminders: readonly ScheduledReminder[]): Promise<void> {
  try {
    const Notifications = await load();
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (reminders.length === 0) return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Rappels',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    for (const reminder of reminders) {
      await Notifications.scheduleNotificationAsync({
        content: { title: reminder.title, body: reminder.body, data: { url: reminder.url } },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminder.at,
          channelId: CHANNEL_ID,
        },
      });
    }
  } catch {
    // Notifications indisponibles : pas de rappel, rien d'autre à faire.
  }
}

/**
 * Écoute le tap sur une notification (app ouverte, en arrière-plan ou lancée par le tap) et
 * transmet l'écran à ouvrir. Renvoie de quoi arrêter l'écoute.
 */
export function onReminderOpened(open: (url: string) => void): () => void {
  let stop = () => {};
  let stopped = false;
  const urlOf = (data: unknown) =>
    data && typeof data === 'object' && 'url' in data && typeof data.url === 'string'
      ? data.url
      : null;

  load()
    .then(async (Notifications) => {
      if (stopped) return;
      // Affiche aussi le rappel quand l'app est au premier plan.
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const url = urlOf(response.notification.request.content.data);
        if (url) open(url);
      });
      stop = () => subscription.remove();

      // App lancée par le tap : la réponse est déjà là avant que l'écoute commence.
      const last = await Notifications.getLastNotificationResponseAsync();
      const url = urlOf(last?.notification.request.content.data);
      if (url && !stopped) {
        await Notifications.clearLastNotificationResponseAsync();
        open(url);
      }
    })
    .catch(() => undefined);

  return () => {
    stopped = true;
    stop();
  };
}
