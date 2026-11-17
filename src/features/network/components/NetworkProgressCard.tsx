import { View } from 'react-native';

import { Card, ProgressBar, Text } from '@/shared/ui';

type Props = {
  /** Part du réseau où l'utilisateur est descendu (0–100). */
  percent: number;
  visited: number;
  total: number;
};

/** Progression globale sur le réseau : le chiffre central de l'app, en grand. UI pure. */
export function NetworkProgressCard({ percent, visited, total }: Props) {
  return (
    <Card className="gap-3">
      <View className="flex-row items-end justify-between gap-3">
        <View className="flex-1">
          <Text variant="label">Ta progression</Text>
          <Text variant="muted">
            {visited} / {total} stations visitées
          </Text>
        </View>
        <Text variant="title" color="accent">
          {percent}%
        </Text>
      </View>
      <ProgressBar percent={percent} />
    </Card>
  );
}
