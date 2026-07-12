import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';

const styles = StyleSheet.create({
  band: { position: 'absolute', top: -40, bottom: -40, width: 70 },
});

/** Reflet lumineux qui balaie en diagonale (célébration d'un élément complété). À placer en overlay. */
export function ShineOverlay() {
  const { width } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(2200),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-90, width] });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} className="overflow-hidden">
      <Animated.View style={[styles.band, { transform: [{ rotate: '18deg' }, { translateX }] }]}>
        <LinearGradient
          // Blanc transparent aux bords (pas `transparent` = noir transparent → gris à l'interpolation).
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
