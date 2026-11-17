import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { isPlural, useTranslation } from '@/i18n';
import { fonts, useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

type Props = {
  count: number;
  onPress: () => void;
  /** `compact` = boussole + nombre (rail) ; `full` = libellé complet (fiche de la carte). */
  variant?: 'compact' | 'full';
};

/** Lien vers les bons plans d'une station. Cible tactile de 44 pt. UI pure. */
export function BonplansLink({ count, onPress, variant = 'compact' }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');
  const label = t(isPlural(count) ? 'bonplans.aroundMany' : 'bonplans.aroundOne', { count });

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="link"
      accessibilityLabel={label}
      className="h-11 flex-row items-center gap-1.5 active:opacity-60"
    >
      <Ionicons name="compass" size={18} color={colors.accent} />
      <Text variant="muted" color="accent" style={{ fontFamily: fonts.semibold }}>
        {variant === 'full' ? label : count}
      </Text>
      {variant === 'full' ? (
        <Ionicons name="chevron-forward" size={16} color={colors.accent} />
      ) : null}
    </Pressable>
  );
}
