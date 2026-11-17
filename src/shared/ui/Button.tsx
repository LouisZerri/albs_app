import { ActivityIndicator, Pressable, type PressableProps, Text } from 'react-native';

import { fonts, useThemeColors } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';

const BASE = 'flex-row items-center justify-center rounded-card px-5 py-3.5';

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-accent',
  secondary: 'bg-accentSoft',
  ghost: 'bg-transparent',
  inverse: 'bg-white',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-accent',
  ghost: 'text-accent',
  inverse: 'text-accent',
};

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
};

/** Bouton du design system. UI pure (la logique arrive via onPress). */
export function Button({
  label,
  variant = 'primary',
  loading,
  disabled,
  className,
  ...rest
}: Props) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(BASE, CONTAINER[variant], isDisabled && 'opacity-50', className)}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.accent} />
      ) : (
        <Text className={cn('text-base', LABEL[variant])} style={{ fontFamily: fonts.semibold }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
