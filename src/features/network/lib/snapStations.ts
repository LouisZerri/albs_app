import type { LineGeo, MapStation } from '../types';

/** Aimante chaque station sur le point de tracé le plus proche → les cercles tombent sur les lignes. */
export function snapStations(lines: LineGeo[], stations: MapStation[]): MapStation[] {
  const points: { lat: number; lng: number }[] = [];
  for (const line of lines) {
    for (const seg of line.geometry ?? []) {
      for (const [lng, lat] of seg) points.push({ lat, lng });
    }
  }
  if (points.length === 0) return stations;

  return stations.map((s) => {
    let bLat = s.lat;
    let bLng = s.lng;
    let bDist = Infinity;
    for (const p of points) {
      const dLat = p.lat - s.lat;
      const dLng = (p.lng - s.lng) * 0.66; // longitude plus courte à Paris
      const dist = dLat * dLat + dLng * dLng;
      if (dist < bDist) {
        bDist = dist;
        bLat = p.lat;
        bLng = p.lng;
      }
    }
    return { ...s, lat: bLat, lng: bLng };
  });
}
