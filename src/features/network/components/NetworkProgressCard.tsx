import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { Card, ProgressBar, Text } from '@/shared/ui';

import type { LineStats } from '../types';
import { LineBadge } from './LineBadge';

type Props = {
  /** Part du réseau où l'utilisateur est descendu (0–100). */
  percent: number;
  visited: number;
  total: number;
  /** La ligne à reprendre (dernière ligne cochée, non terminée), s'il y en a une. */
  resume: LineStats | null;
  onResume: (lineId: number) => void;
};

/**
 * Progression globale sur le réseau (le chiffre central de l'app, en grand) et, en pied de carte,
 * le raccourci pour reprendre la dernière ligne. UI pure.
 */
export function NetworkProgressCard({ percent, visited, total, resume, onResume }: Props) {
  const colors = useThemeColors();
  const remaining = resume ? resume.total - resume.visited : 0;

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

      {resume ? (
        <Pressable
          onPress={() => onResume(resume.id)}
          accessibilityRole="button"
          accessibilityLabel={`Continuer la ligne ${resume.number}, plus que ${remaining} stations`}
          className="-mb-1 min-h-[44px] flex-row items-center gap-2.5 border-t border-hair pt-3 active:opacity-60"
        >
          <LineBadge
            number={resume.number}
            color={resume.color}
            textColor={resume.textColor}
            size={26}
          />
          <Text className="flex-1" numberOfLines={1}>
            Continuer la ligne {resume.number}
            <Text variant="muted"> · plus que {remaining}</Text>
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.accent} />
        </Pressable>
      ) : null}
    </Card>
  );
}
