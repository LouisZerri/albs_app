import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { dateLocale, useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { SubScreen, Text, useToast } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import { useAcknowledgeWarning, useWarnings } from '../hooks';
import type { Warning } from '../types';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(dateLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Écran des avertissements de modération : lecture + accusé de réception. */
export function WarningsScreen() {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const router = useRouter();
  const warnings = useWarnings();
  const ack = useAcknowledgeWarning();
  const toast = useToast();

  const acknowledge = (id: number) => {
    ack.mutate(id, { onError: (e) => toast.show(e.message, 'error') });
  };

  return (
    <SubScreen title={t('warnings.title')} onBack={() => router.back()}>
      {warnings.isPending ? (
        <View className="items-center py-10">
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : warnings.data && warnings.data.length > 0 ? (
        <View className="gap-3 py-3 pb-10">
          {warnings.data.map((w) => (
            <WarningCard
              key={w.id}
              warning={w}
              pending={ack.isPending && ack.variables === w.id}
              onAcknowledge={() => acknowledge(w.id)}
            />
          ))}
        </View>
      ) : (
        <View className="items-center gap-2 py-16">
          <Text className="text-5xl">🎉</Text>
          <Text variant="subtitle" className="text-center">
            {t('warnings.emptyTitle')}
          </Text>
          <Text variant="muted" className="text-center">
            {t('warnings.emptyHint')}
          </Text>
        </View>
      )}
    </SubScreen>
  );
}

function WarningCard({
  warning,
  pending,
  onAcknowledge,
}: {
  warning: Warning;
  pending: boolean;
  onAcknowledge: () => void;
}) {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const read = Boolean(warning.acknowledgedAt);

  return (
    <View
      className={cn(
        'gap-2 rounded-card border p-4',
        read ? 'border-hair bg-surface' : 'border-danger/40 bg-danger/5',
      )}
    >
      <View className="flex-row items-center justify-between">
        <Text variant="muted" className="text-xs">
          {formatDate(warning.createdAt)}
        </Text>
        {read ? (
          <View className="flex-row items-center gap-1">
            <Ionicons name="checkmark-circle" size={14} color={colors.visited} />
            <Text variant="muted" color="visited" className="text-xs">
              {t('warnings.read')}
            </Text>
          </View>
        ) : (
          <View className="rounded-pill bg-danger px-2 py-0.5">
            <Text variant="label" color="white" className="text-[10px]">
              {t('warnings.unread')}
            </Text>
          </View>
        )}
      </View>

      <Text variant="body" className="text-sm">
        {warning.reason}
      </Text>

      {!read ? (
        <Pressable
          onPress={onAcknowledge}
          disabled={pending}
          className="mt-1 items-center rounded-card border border-danger/40 py-2.5 active:opacity-70"
        >
          {pending ? (
            <ActivityIndicator color={colors.danger} />
          ) : (
            <Text variant="subtitle" color="danger" className="text-sm">
              {t('warnings.acknowledge')}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
