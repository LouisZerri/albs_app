import { Text as RNText, type TextProps } from 'react-native';

import { fonts, type ThemeColor, useThemeColors } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

export type TextVariant = 'title' | 'subtitle' | 'body' | 'muted' | 'label';

// className = taille/couleur (NativeWind) ; font = la famille Montserrat du bon poids.
const VARIANTS: Record<TextVariant, { className: string; font: string }> = {
  title: { className: 'text-3xl text-ink', font: fonts.extrabold },
  subtitle: { className: 'text-lg text-ink', font: fonts.semibold },
  body: { className: 'text-base text-ink', font: fonts.regular },
  muted: { className: 'text-sm text-muted', font: fonts.regular },
  label: { className: 'text-xs uppercase tracking-wide text-muted', font: fonts.semibold },
};

type Props = TextProps & {
  variant?: TextVariant;
  /** Couleur du thème, appliquée en style inline (l'emporte sur la classe de la variante). */
  color?: ThemeColor;
  className?: string;
};

/** Texte typé selon les variantes du design system. UI pure. */
export function Text({ variant = 'body', color, className, style, ...rest }: Props) {
  const colors = useThemeColors();
  const v = VARIANTS[variant];
  return (
    <RNText
      className={cn(v.className, className)}
      style={[{ fontFamily: v.font }, color ? { color: colors[color] } : null, style]}
      {...rest}
    />
  );
}
