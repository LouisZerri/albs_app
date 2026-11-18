import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { OfflineNotice, ProgressBar, Text } from '@/shared/ui';

import type { LineDetail } from '../types';
import { LineBadge } from './LineBadge';

type Props = {
  line: LineDetail;
  visited: number;
  total: number;
  percent: number;
  onBack: () => void;
  /** Lance la saisie d'un trajet (départ → arrivée) sur cette ligne. */
  onAddTrip: () => void;
};

/** En-tête de l'écran rail : bouton retour, pastille, noms, progression de la ligne. */
export function LineHeader({ line, visited, total, percent, onBack, onAddTrip }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');
  const insets = useSafeAreaInsets();

  return (
    <View className="border-b border-hair bg-surface pb-4" style={{ paddingTop: insets.top }}>
      <OfflineNotice />
      <View className="px-5 pt-1.5">
        <Pressable
          onPress={onBack}
          hitSlop={8}
          className="-ml-1 mb-2 h-8 w-8 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>

        <View className="flex-row items-center gap-3">
          <LineBadge number={line.number} color={line.color} textColor={line.textColor} size={48} />
          <View className="flex-1">
            <Text variant="subtitle">{t('lineName', { number: line.number })}</Text>
            <Text variant="muted" numberOfLines={1}>
              {line.name}
            </Text>
          </View>
          <Pressable
            onPress={onAddTrip}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('trip.addA11y')}
            className="flex-row items-center gap-1.5 rounded-pill bg-accentSoft px-3 py-2 active:opacity-70"
          >
            <Ionicons name="swap-vertical" size={16} color={colors.accent} />
            <Text variant="label" color="accent">
              {t('trip.add')}
            </Text>
          </Pressable>
        </View>

        <View className="mt-3 gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text variant="muted">{t('stationsVisited', { visited, total })}</Text>
            <Text variant="subtitle" color="accent">
              {percent}%
            </Text>
          </View>
          <ProgressBar percent={percent} color={line.color} />
        </View>
      </View>
    </View>
  );
}
