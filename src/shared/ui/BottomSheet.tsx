import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Animated, PanResponder, View } from 'react-native';

type Props = {
  /** Hauteur visible quand le panneau est réduit / agrandi (en points). */
  collapsedHeight: number;
  expandedHeight: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** Contenu fixe sous la poignée (filtres…). */
  header?: ReactNode;
  children: ReactNode;
};

/** En dessous de ce déplacement, le geste sur la poignée est un tap (bascule) et non un glissé. */
const TAP_SLOP = 6;
/** Au-delà de cette vitesse (pt/ms), c'est le sens du geste qui décide, pas la position. */
const FLING_VELOCITY = 0.4;

/**
 * Panneau coulissant à deux positions, posé en bas de son parent (par-dessus une carte, etc.).
 * Il se déplace par sa poignée (glisser, ou toucher pour basculer) ; son contenu défile librement.
 * Composant contrôlé : le parent détient `expanded`. Réduit, son bas dépasse du parent : celui-ci
 * doit être en `overflow-hidden`. UI pure.
 */
export function BottomSheet({
  collapsedHeight,
  expandedHeight,
  expanded,
  onExpandedChange,
  header,
  children,
}: Props) {
  // Course du panneau : 0 = agrandi, `travel` = réduit (décalé vers le bas).
  const travel = Math.max(0, expandedHeight - collapsedHeight);
  const rest = expanded ? 0 : travel;
  const [translateY] = useState(() => new Animated.Value(rest));

  const settle = useCallback(
    (toValue: number) => {
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }).start();
    },
    [translateY],
  );

  useEffect(() => settle(rest), [rest, settle]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_event, gesture) => {
          translateY.setValue(Math.min(travel, Math.max(0, rest + gesture.dy)));
        },
        onPanResponderRelease: (_event, gesture) => {
          const next =
            Math.abs(gesture.dy) < TAP_SLOP
              ? !expanded
              : Math.abs(gesture.vy) > FLING_VELOCITY
                ? gesture.vy < 0
                : rest + gesture.dy < travel / 2;

          if (next === expanded) settle(rest);
          else onExpandedChange(next);
        },
        onPanResponderTerminate: () => settle(rest),
      }),
    [expanded, onExpandedChange, rest, settle, translateY, travel],
  );

  return (
    <Animated.View
      className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-3xl border-t border-hair bg-bg"
      style={{ height: expandedHeight, transform: [{ translateY }] }}
    >
      <View
        {...pan.panHandlers}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Réduire la liste' : 'Agrandir la liste'}
        className="h-9 items-center justify-center"
      >
        <View className="h-1.5 w-11 rounded-full bg-hair" />
      </View>

      {header}
      <View className="flex-1">{children}</View>
    </Animated.View>
  );
}
