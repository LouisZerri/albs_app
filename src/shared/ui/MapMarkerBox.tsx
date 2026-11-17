import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';

type Props = {
  /** Côté de la boîte, en points : son centre est le point de la carte désigné par le `Marker`. */
  size: number;
  children: ReactNode;
};

/**
 * Contenu d'un `Marker` personnalisé, EXACTEMENT centré sur sa coordonnée.
 *
 * Pourquoi ce composant : sur iOS (Apple Plans, nouvelle architecture), react-native-maps ne
 * donne pas de taille à la vue du repère et ignore `anchor`. Le contenu est alors dessiné à partir
 * de la coordonnée vers le bas et la droite : un point de 24 pt se retrouve décalé de 12 pt, donc
 * à côté du tracé de sa ligne. On pose ici une boîte de taille nulle sur la coordonnée, et le
 * contenu déborde également de chaque côté : centré quelle que soit la taille retenue par la carte.
 *
 * Sur Android le repère est une image de la taille mesurée du contenu (une boîte vide ne
 * dessinerait rien) : boîte normale, centrée par `anchor={{ x: 0.5, y: 0.5 }}` sur le `Marker`.
 */
export function MapMarkerBox({ size, children }: Props) {
  const box = { width: size, height: size, alignItems: 'center', justifyContent: 'center' } as const;

  if (Platform.OS !== 'ios') {
    return <View style={box}>{children}</View>;
  }

  return (
    <View style={{ width: 0, height: 0 }}>
      <View style={{ ...box, position: 'absolute', left: -size / 2, top: -size / 2 }}>
        {children}
      </View>
    </View>
  );
}
