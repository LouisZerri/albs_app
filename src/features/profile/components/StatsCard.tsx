import { View } from 'react-native';

import { colors } from '@/shared/theme';
import { Card, ProgressBar, Text } from '@/shared/ui';

type Row = { icon: string; label: string; value: number; max: number; color: string };

type Props = {
  passed: number;
  visited: number;
  totalStations: number;
  badgesEarned: number;
  badgesTotal: number;
};

/** Bloc « Statistiques » du profil : 3 barres de progression. UI pure. */
export function StatsCard({ passed, visited, totalStations, badgesEarned, badgesTotal }: Props) {
  const rows: Row[] = [
    { icon: '🚶', label: 'Stations passées', value: passed, max: totalStations, color: colors.passed },
    { icon: '✅', label: 'Stations descendues', value: visited, max: totalStations, color: colors.visited },
    { icon: '🏆', label: 'Badges', value: badgesEarned, max: badgesTotal, color: colors.accent },
  ];

  return (
    <Card className="gap-4">
      <Text variant="label">Statistiques</Text>

      {rows.map((row) => {
        const percent = row.max > 0 ? Math.round((row.value / row.max) * 100) : 0;
        return (
          <View key={row.label} className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text variant="muted">
                {row.icon} {row.label}
              </Text>
              <Text variant="subtitle" className="text-sm" style={{ color: row.color }}>
                {row.value}/{row.max}
              </Text>
            </View>
            <ProgressBar percent={percent} color={row.color} />
          </View>
        );
      })}
    </Card>
  );
}
