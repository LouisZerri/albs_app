import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  /** Côté de la boîte, en points : son centre est le point de la carte désigné par le `Marker`. */
  size: number;
  children: ReactNode;
};

/**
 * Contenu d'un `Marker` personnalisé, EXACTEMENT centré sur sa coordonnée.
 *
 * Pourquoi ce composant : sur iOS, react-native-maps donne au repère la taille de sa PREMIÈRE vue
 * native, et le centre sur la coordonnée. Or React Native supprime les vues qui ne servent qu'à la
 * mise en page (« aplatissement ») : une boîte transparente autour d'un petit point disparaît, la
 * première vue native devient le point lui-même, placé à l'écart de l'origine — et il s'affiche
 * décalé, à côté du tracé de sa ligne (mesuré : 7,5 pt pour un point de 9 pt dans une boîte de 24).
 *
 * `collapsable={false}` garde la boîte comme vraie vue native : le repère prend sa taille, et son
 * contenu centré tombe pile sur la coordonnée. (Avec `anchor={{ x: 0.5, y: 0.5 }}` sur le `Marker`
 * pour Android.)
 */
export function MapMarkerBox({ size, children }: Props) {
  return (
    <View
      collapsable={false}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      {children}
    </View>
  );
}
