import type { LineDetail, Station } from '../types';

export type LoopGroup = { directionLabel: string; stations: Station[] };
export type LoopData = { label: string; groups: LoopGroup[] };

/** Station de boucle à sens unique (desservie dans un seul sens). */
export function isLoopStation(s: Station): boolean {
  return s.branch === 'direction' || s.branch === 'retour';
}

/** Extrait la boucle d'une ligne (ex. Boucle d'Auteuil, ligne 10) : stations groupées par sens. */
export function getLoop(line: LineDetail): LoopData | null {
  if (!line.loop) return null;

  const loopStations = line.stations.filter(isLoopStation);
  if (loopStations.length === 0) return null;

  const groups: LoopGroup[] = [];
  for (const s of loopStations) {
    const directionLabel = s.directionLabel ?? 'Boucle';
    let group = groups.find((g) => g.directionLabel === directionLabel);
    if (!group) {
      group = { directionLabel, stations: [] };
      groups.push(group);
    }
    group.stations.push(s);
  }

  return { label: line.loop.label, groups };
}
