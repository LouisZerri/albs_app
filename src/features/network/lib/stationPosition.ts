import type { MapStation } from '../types';

/**
 * Où dessiner une station sur la carte.
 *
 * Une station à plusieurs lignes n'a qu'un point, placé au mieux entre ses lignes : quand elles
 * sont éloignées (Montparnasse), il ne peut pas être sur toutes. Quand UNE ligne est mise en
 * avant, on prend la position de la station sur cette ligne-là (fournie par l'API), pile sur
 * son trait. Sinon, ou si l'API ne la donne pas : le point commun.
 */
export function stationPosition(
  station: MapStation,
  highlightedLineId: number | null,
): { lat: number; lng: number } {
  const onLine =
    highlightedLineId === null
      ? undefined
      : station.lines.find((line) => line.lineId === highlightedLineId);

  return onLine?.lat !== undefined && onLine.lng !== undefined
    ? { lat: onLine.lat, lng: onLine.lng }
    : { lat: station.lat, lng: station.lng };
}
