import { LinearGradient } from 'expo-linear-gradient';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { useTranslation } from '@/i18n';
import { ShineOverlay, Text } from '@/shared/ui';

/** Ce qu'on célèbre : un badge par défaut ; `label` permet un autre intitulé (ex. « Ligne terminée »). */
export type CelebrationBadge = { name: string; icon: string; label?: string };

const GOLD = ['#F7CE5B', '#E0A422', '#C6890F'] as const;
const VISIBLE_MS = 4000;

type ContextValue = { celebrate: (badges: CelebrationBadge[]) => void };
const BadgeCelebrationContext = createContext<ContextValue | null>(null);

export function BadgeCelebrationProvider({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const [queue, setQueue] = useState<CelebrationBadge[]>([]);
  const [burst, setBurst] = useState(0);

  const current = queue[0] ?? null;

  const celebrate = useCallback((badges: CelebrationBadge[]) => {
    if (badges.length === 0) return;
    setQueue((q) => [...q, ...badges]);
    setBurst((b) => b + 1);
  }, []);

  const dismiss = useCallback(() => setQueue((q) => q.slice(1)), []);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [current, dismiss]);

  const value = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <BadgeCelebrationContext.Provider value={value}>
      <View className="flex-1">{children}</View>

      {current ? (
        <BadgeCard key={current.name + queue.length} badge={current} onDismiss={dismiss} />
      ) : null}

      {burst > 0 ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <ConfettiCannon
            key={burst}
            count={140}
            origin={{ x: width / 2, y: 0 }}
            autoStart
            fadeOut
            fallSpeed={2600}
          />
        </View>
      ) : null}
    </BadgeCelebrationContext.Provider>
  );
}

function BadgeCard({ badge, onDismiss }: { badge: CelebrationBadge; onDismiss: () => void }) {
  const { t } = useTranslation('badges');
  const [scale] = useState(() => new Animated.Value(0.8));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { opacity }]}
      className="items-center justify-center"
    >
      <Pressable className="absolute inset-0 bg-black/40" onPress={onDismiss} />

      <Animated.View
        style={{ transform: [{ scale }] }}
        className="w-72 overflow-hidden rounded-card"
      >
        <LinearGradient colors={GOLD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View className="items-center gap-2 px-6 py-7">
            <Text variant="label" color="white">
              {badge.label ?? t('celebration.unlocked')}
            </Text>
            <Text className="text-6xl">{badge.icon}</Text>
            <Text variant="subtitle" color="white" className="text-center">
              {badge.name}
            </Text>
          </View>
        </LinearGradient>
        <ShineOverlay />
      </Animated.View>
    </Animated.View>
  );
}

export function useBadgeCelebration(): ContextValue {
  const ctx = useContext(BadgeCelebrationContext);
  if (!ctx) {
    throw new Error('useBadgeCelebration doit être utilisé dans un <BadgeCelebrationProvider>.');
  }
  return ctx;
}
