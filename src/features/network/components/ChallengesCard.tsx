import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Card, ProgressBar, Text } from '@/shared/ui';

import type { Challenge } from '../types';

type Props = {
  challenges: Challenge[];
  /** Ouvre la ligne visée par un défi « Termine la ligne X ». */
  onOpenLine: (lineId: number) => void;
};

/** Défis en cours (semaine, mois, ligne presque finie) avec leur avancement. UI pure. */
export function ChallengesCard({ challenges, onOpenLine }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');

  return (
    <Card className="gap-3">
      <Text variant="label">{t('challenges.title')}</Text>

      {challenges.map((challenge) => {
        const done = challenge.current >= challenge.target;
        const lineId = challenge.lineId;
        return (
          <Pressable
            key={challenge.key}
            // Seul un défi lié à une ligne mène quelque part.
            disabled={lineId === null}
            onPress={lineId !== null ? () => onOpenLine(lineId) : undefined}
            accessibilityLabel={t('challenges.a11y', {
              title: challenge.title,
              current: challenge.current,
              target: challenge.target,
            })}
            className="gap-1.5 active:opacity-70"
          >
            <View className="flex-row items-center gap-2">
              <Text className="flex-1" numberOfLines={1}>
                {challenge.title}
              </Text>
              {done ? (
                <Ionicons name="checkmark-circle" size={18} color={colors.visited} />
              ) : (
                <Text variant="muted">
                  {challenge.current}/{challenge.target}
                </Text>
              )}
            </View>
            <ProgressBar
              percent={(challenge.current / challenge.target) * 100}
              color={done ? colors.visited : undefined}
            />
          </Pressable>
        );
      })}
    </Card>
  );
}
