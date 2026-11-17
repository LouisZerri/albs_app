import { Polygon, Polyline } from 'react-native-maps';

import { PARIS_OUTLINE, RIVERS, type BasemapPath } from '@/shared/constants/parisBasemap';
import { useThemeColors } from '@/shared/theme';

type Props = {
  /** Hauteur visible de la carte, en degrés de latitude (le zoom) : règle l'épaisseur de la Seine. */
  latitudeDelta: number;
};

const toCoordinates = (path: BasemapPath) =>
  path.map(([latitude, longitude]) => ({ latitude, longitude }));

// Calculés une fois : ces tracés ne changent jamais.
const PARIS = toCoordinates(PARIS_OUTLINE);
const RIVER_PATHS = RIVERS.map(toCoordinates);
/** Un grand rectangle autour de l'Île-de-France : masque le fond de carte, vide sans réseau. */
const GROUND = [
  { latitude: 49.6, longitude: 1.2 },
  { latitude: 49.6, longitude: 3.6 },
  { latitude: 48.1, longitude: 3.6 },
  { latitude: 48.1, longitude: 1.2 },
];

const METERS_PER_DEGREE = 111_320;
/** Largeur de la Seine dans Paris, et hauteur d'écran typique d'une carte de l'app. */
const RIVER_WIDTH_M = 130;
const TYPICAL_MAP_HEIGHT = 650;

/** Épaisseur du trait de la Seine à ce niveau de zoom (bornée : toujours visible, jamais envahissante). */
function riverStrokeWidth(latitudeDelta: number): number {
  const pixels = (RIVER_WIDTH_M / (latitudeDelta * METERS_PER_DEGREE)) * TYPICAL_MAP_HEIGHT;
  return Math.max(3, Math.min(48, pixels));
}

/**
 * Fond de carte de secours, dessiné par l'app quand il n'y a pas de réseau : sous terre, les
 * tuiles de la carte ne se chargent pas et les lignes flotteraient dans le vide. Le contour de
 * Paris et la Seine suffisent à se repérer.
 *
 * À placer dans une `MapView`, AVANT les tracés et les points : il doit être dessiné dessous.
 */
export function OfflineBasemap({ latitudeDelta }: Props) {
  const colors = useThemeColors();

  return (
    <>
      <Polygon coordinates={GROUND} fillColor={colors.mapLand} strokeWidth={0} zIndex={-3} />
      <Polygon
        coordinates={PARIS}
        fillColor={colors.mapCity}
        strokeColor={colors.hair}
        strokeWidth={1}
        zIndex={-2}
      />
      {RIVER_PATHS.map((path, i) => (
        <Polyline
          key={i}
          coordinates={path}
          strokeColor={colors.mapWater}
          strokeWidth={riverStrokeWidth(latitudeDelta)}
          lineCap="round"
          lineJoin="round"
          zIndex={-1}
        />
      ))}
    </>
  );
}
