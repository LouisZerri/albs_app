import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { LineRow } from '@/features/network/components';
import type { LineStats } from '@/features/network/types';
import { useTranslation } from '@/i18n';
import { Text } from '@/shared/ui';

/** Onglet Progression : les lignes entamées, triées par complétion. UI pure (sauf navigation). */
export function ProgressionTab({ lines }: { lines: LineStats[] }) {
  const router = useRouter();
  const { t } = useTranslation('profile');

  const started = useMemo(
    () => lines.filter((l) => l.passed > 0 || l.visited > 0).sort((a, b) => b.percent - a.percent),
    [lines],
  );

  if (started.length === 0) {
    return (
      <View className="items-center gap-2 py-10">
        <Text className="text-5xl">🚇</Text>
        <Text variant="subtitle" className="text-center">
          {t('progression.emptyTitle')}
        </Text>
        <Text variant="muted" className="text-center">
          {t('progression.emptyHint')}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {started.map((line) => (
        <LineRow key={line.id} line={line} onPress={() => router.push(`/line/${line.id}`)} />
      ))}
    </View>
  );
}
