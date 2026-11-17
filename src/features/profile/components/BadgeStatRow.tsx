import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text as RNText, View } from 'react-native';

import { useThemeColors } from '@/shared/theme';
import { ProgressBar, Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { BadgeStatus } from '../types';

type Props = {
  badge: BadgeStatus;
  /** Badge mis en avant sur le profil (vitrine). */
  displayed?: boolean;
  /** Fourni pour un badge acquis → affiche le bouton étoile « vitrine ». */
  onToggleDisplay?: () => void;
};

/** Une carte badge : dorée + coche si acquise, grisée + progression sinon. UI pure. */
export function BadgeStatRow({ badge, displayed, onToggleDisplay }: Props) {
  const colors = useThemeColors();
  return (
    <View
      className={cn(
        'flex-row items-center gap-3 rounded-card border p-3.5',
        badge.earned ? 'border-[#FBBF24] bg-goldSoft' : 'border-hair bg-surface',
      )}>
      <View className="relative h-11 w-11 items-center justify-center">
        {/* Emoji : Text brut (police système, pas de variante) sinon il rétrécit. */}
        <RNText className={cn('text-4xl', !badge.earned && 'opacity-30')}>{badge.icon}</RNText>
        {badge.earned ? (
          <View className="absolute -right-1 -top-1 rounded-full bg-surface">
            <Ionicons name="checkmark-circle" size={18} color={colors.visited} />
          </View>
        ) : null}
      </View>

      <View className="flex-1 gap-1">
        <Text variant="subtitle" className="text-sm">
          {badge.name}
        </Text>
        <Text variant="muted" className="text-xs leading-4">
          {badge.description}
        </Text>

        {!badge.earned ? (
          <View className="mt-1 gap-1">
            <View className="flex-row justify-end">
              <Text variant="muted" className="text-xs" style={{ color: colors.accent }}>
                {badge.current !== null && badge.target !== null
                  ? `${badge.current} / ${badge.target}`
                  : `${badge.progress}%`}
              </Text>
            </View>
            <ProgressBar percent={badge.progress} />
          </View>
        ) : null}
      </View>

      {badge.earned && onToggleDisplay ? (
        <Pressable
          onPress={onToggleDisplay}
          hitSlop={8}
          className="p-1 active:opacity-60"
          accessibilityLabel={displayed ? 'Retirer de la vitrine' : 'Mettre en vitrine'}>
          <Ionicons
            name={displayed ? 'star' : 'star-outline'}
            size={22}
            color={displayed ? '#E0A422' : colors.muted}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
