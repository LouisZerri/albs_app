import { Pressable, type PressableProps } from 'react-native';

import { fonts } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

import { Text } from './Text';

type Props = {
  label: string;
  onPress: PressableProps['onPress'];
  className?: string;
};

/** Lien texte (couleur accent, tappable). UI pure. */
export function TextLink({ label, onPress, className }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={8}>
      <Text
        variant="muted"
        className={cn('text-accent', className)}
        style={{ fontFamily: fonts.semibold }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
