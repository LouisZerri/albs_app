import type { LineDetail, Station } from '../types';

/** `directionLabel` nul = sens non précisé par le serveur : l'écran affiche alors un libellé par défaut. */
export type LoopGroup = { directionLabel: string | null; stations: Station[] };
export type LoopData = { label: string; groups: LoopGroup[] };

/** Station de boucle à sens unique (desservie dans un seul sens). */
export function isLoopStation(s: Pick<Station, 'branch'>): boolean {
  return s.branch === 'direction' || s.branch === 'retour';
}

/** Extrait la boucle d'une ligne (ex. Boucle d'Auteuil, ligne 10) : stations groupées par sens. */
export function getLoop(line: LineDetail): LoopData | null {
  if (!line.loop) return null;

  const loopStations = line.stations.filter(isLoopStation);
  if (loopStations.length === 0) return null;

  const groups: LoopGroup[] = [];
  for (const s of loopStations) {
    const directionLabel = s.directionLabel ?? null;
    let group = groups.find((g) => g.directionLabel === directionLabel);
    if (!group) {
      group = { directionLabel, stations: [] };
      groups.push(group);
    }
    group.stations.push(s);
  }

  return { label: line.loop.label, groups };
}
