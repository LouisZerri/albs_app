import { normalizeSearch } from '@/shared/utils/normalizeSearch';

import type { Correspondence, MapStation } from '../types';

/** Un résultat de recherche : une station sur UNE de ses lignes (ouvre le rail de cette ligne). */
export type StationHit = { key: string; name: string; line: Correspondence };

const MAX_HITS = 40;

/**
 * Stations dont le nom contient la recherche (insensible à la casse et aux accents), dépliées
 * par ligne : « Châtelet » donne une entrée par ligne qui la dessert. Noms commençant par la
 * recherche en premier.
 */
export function searchStations(stations: MapStation[], query: string): StationHit[] {
  const q = normalizeSearch(query);
  if (q === '') return [];

  return stations
    .map((station) => ({ station, name: normalizeSearch(station.name) }))
    .filter(({ name }) => name.includes(q))
    .sort(
      (a, b) =>
        Number(b.name.startsWith(q)) - Number(a.name.startsWith(q)) ||
        a.station.name.localeCompare(b.station.name, 'fr'),
    )
    .flatMap(({ station }) =>
      station.lines.map((line) => ({
        key: `${station.id}-${line.lineId}`,
        name: station.name,
        line,
      })),
    )
    .slice(0, MAX_HITS);
}
