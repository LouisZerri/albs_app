import { Ionicons } from '@expo/vector-icons';
import { Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';

import { Text } from '../Text';
import type { ToastState, ToastVariant } from './types';

const VARIANTS: Record<ToastVariant, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  success: { icon: 'checkmark-circle', color: colors.visited },
  error: { icon: 'alert-circle', color: colors.danger },
  info: { icon: 'information-circle', color: colors.accent },
};

type Props = {
  toast: ToastState;
  anim: Animated.Value;
  onPress: () => void;
};

/** Rendu visuel du toast (bannière en haut, animée). UI pure. */
export function ToastView({ toast, anim, onPress }: Props) {
  const insets = useSafeAreaInsets();
  const cfg = VARIANTS[toast.variant];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
      }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="alert"
        className="flex-row items-center gap-3 rounded-card border border-hair bg-surface px-4 py-3.5"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: cfg.color,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}>
        <Ionicons name={cfg.icon} size={22} color={cfg.color} />
        <Text variant="body" className="flex-1">
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
