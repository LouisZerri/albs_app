import { Polygon, Polyline } from 'react-native-maps';

import { PARIS_OUTLINE, RIVERS, type BasemapPath } from '@/shared/constants/parisBasemap';
import { useThemeColors } from '@/shared/theme';

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

/**
 * Épaisseur FIXE de la Seine : un simple repère, pas plus visible qu'une ligne de métro.
 * ⚠️ Ne pas la faire varier avec le zoom : sur iOS, modifier une propriété d'un tracé le retire
 * puis le rajoute sur la carte, donc AU-DESSUS des lignes (l'ordre de dessin est l'ordre d'ajout,
 * `zIndex` est ignoré par Apple Plans).
 */
const RIVER_STROKE_WIDTH = 3;

/**
 * Fond de carte de secours, dessiné par l'app quand il n'y a pas de réseau : sous terre, les
 * tuiles de la carte ne se chargent pas et les lignes flotteraient dans le vide. Le contour de
 * Paris et la Seine suffisent à se repérer.
 *
 * À placer dans une `MapView`, AVANT les tracés et les points, et à monter EN MÊME TEMPS qu'eux
 * (voir la clé de remontage dans `MapScreen`) : l'ordre de dessin est l'ordre d'ajout sur la carte.
 */
export function OfflineBasemap() {
  const colors = useThemeColors();

  return (
    <>
      <Polygon coordinates={GROUND} fillColor={colors.mapLand} strokeWidth={0} />
      <Polygon
        coordinates={PARIS}
        fillColor={colors.mapCity}
        strokeColor={colors.hair}
        strokeWidth={1}
      />
      {RIVER_PATHS.map((path, i) => (
        <Polyline
          key={i}
          coordinates={path}
          strokeColor={colors.mapWater}
          strokeWidth={RIVER_STROKE_WIDTH}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </>
  );
}
