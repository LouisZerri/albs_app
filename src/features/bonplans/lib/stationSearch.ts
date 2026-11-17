import { i18n, isPlural } from '@/i18n/instance';
import type { Correspondence } from '@/features/network/types';
import { normalizeSearch } from '@/shared/utils/normalizeSearch';

import type { BonplanStation } from '../types';

export type StationFilter = {
  /** Texte recherché dans le nom (insensible à la casse et aux accents). */
  query: string;
  /** Ne garder que les stations desservies par cette ligne (null = toutes). */
  lineId: number | null;
  /** Ne garder que les stations où l'utilisateur est descendu. */
  visitedOnly: boolean;
};

/** Applique les filtres de l'accueil Bons plans (tous cumulables). */
export function filterStations(
  stations: BonplanStation[],
  { query, lineId, visitedOnly }: StationFilter,
  visitedIds: ReadonlySet<number>,
): BonplanStation[] {
  const q = normalizeSearch(query);

  return stations.filter(
    (s) =>
      (q === '' || normalizeSearch(s.name).includes(q)) &&
      (lineId === null || s.lines.some((l) => l.lineId === lineId)) &&
      (!visitedOnly || visitedIds.has(s.id)),
  );
}

/** Toutes les lignes desservant au moins une station de la liste, dans l'ordre du réseau. */
export function linesOf(stations: BonplanStation[]): Correspondence[] {
  const byId = new Map<number, Correspondence>();
  for (const s of stations) {
    for (const line of s.lines) byId.set(line.lineId, line);
  }
  return [...byId.values()].sort((a, b) => a.lineId - b.lineId);
}

/** « 1 bon plan » / « 12 bons plans » (zéro a sa propre clé : il s'accorde autrement en anglais). */
export function bonplanCountLabel(count: number): string {
  const key = isPlural(count) ? 'countMany' : count === 1 ? 'countOne' : 'countZero';
  return i18n.t(`bonplans:${key}`, { count });
}

/** « ligne 6 » / « lignes 1, 4, 7 » (pour les lecteurs d'écran). */
export function lineNumbersLabel(lines: Correspondence[]): string {
  const numbers = lines.map((l) => l.number).join(', ');
  return i18n.t(isPlural(lines.length) ? 'bonplans:lineMany' : 'bonplans:lineOne', { numbers });
}
