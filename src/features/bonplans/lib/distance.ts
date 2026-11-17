import type { Bonplan } from '../types';

export type LatLng = { latitude: number; longitude: number };

/** Un bon plan + sa distance à la station (null si l'un des deux n'est pas géolocalisé). */
export type NearbyBonplan = Bonplan & { distance: number | null };

const EARTH_RADIUS_M = 6_371_000;
/** Vitesse de marche retenue (identique au web) : 80 m/min ≈ 4,8 km/h. */
const WALK_METERS_PER_MIN = 80;

export function coordinateOf(bonplan: Bonplan): LatLng | null {
  return bonplan.latitude !== null && bonplan.longitude !== null
    ? { latitude: bonplan.latitude, longitude: bonplan.longitude }
    : null;
}

/** Distance à vol d'oiseau (haversine), en mètres. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Un bon plan proposé par un membre (par opposition à l'import OpenStreetMap). */
export function isCommunity(bonplan: Bonplan): boolean {
  return bonplan.source === 'community';
}

/**
 * Ajoute la distance à la station et ordonne la liste : d'abord les bons plans de la communauté
 * (recommandations de membres), puis du plus proche au plus loin (non géolocalisés en dernier).
 */
export function sortByDistance(bonplans: Bonplan[], station: LatLng | null): NearbyBonplan[] {
  return bonplans
    .map((b) => {
      const coordinate = coordinateOf(b);
      return { ...b, distance: station && coordinate ? distanceMeters(station, coordinate) : null };
    })
    .sort(
      (a, b) =>
        Number(isCommunity(b)) - Number(isCommunity(a)) ||
        (a.distance ?? Infinity) - (b.distance ?? Infinity),
    );
}

/** « 250 m · 3 min à pied » (distance arrondie à 10 m, puis en km au-delà de 1 km). */
export function walkLabel(meters: number): string {
  const distance =
    meters < 1000
      ? `${Math.round(meters / 10) * 10} m`
      : `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
  const minutes = Math.max(1, Math.round(meters / WALK_METERS_PER_MIN));
  return `${distance} · ${minutes} min à pied`;
}

/** Région de carte englobant tous les points, avec une marge. */
export function regionAround(points: LatLng[]) {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.004, (maxLat - minLat) * 1.4),
    longitudeDelta: Math.max(0.004, (maxLng - minLng) * 1.4),
  };
}
