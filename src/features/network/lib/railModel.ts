import type { LineDetail, ProgressEntry, Station } from '../types';
import { displayStations, getBranches, isForkStation, type Branch } from './forkModel';
import { getLoop, isLoopStation, type LoopData } from './loopModel';

/** Un élément du rail : une station, la station-fourche (avec son sélecteur) ou le bloc boucle. */
export type RailItem =
  | { type: 'station'; station: Station; hideTop: boolean; hideBottom: boolean }
  | { type: 'fork'; station: Station }
  | { type: 'loop' };

export type RailModel = {
  items: RailItem[];
  branches: Branch[];
  selectedBranch: string | null;
  /** Les branches sont-elles affichées EN DESSOUS de la fourche (ex. ligne 7) ? */
  branchesBelow: boolean;
  loop: LoopData | null;
  /** Les vraies stations de la ligne (toutes branches, hors marqueur de fourche) : base des compteurs. */
  realStations: Station[];
};

/** Construit le rail à afficher : stations de la branche choisie + fourche ou boucle repliée en un bloc. */
export function buildRail(line: LineDetail, branch: string | null): RailModel {
  const branches = getBranches(line.stations);
  const selectedBranch = branch ?? branches[0]?.key ?? null;
  const shown =
    branches.length > 0 ? displayStations(line.stations, selectedBranch) : line.stations;
  const forkIndex = branches.length > 0 ? shown.findIndex(isForkStation) : -1;
  const afterFork = forkIndex >= 0 ? shown[forkIndex + 1] : undefined;
  const branchesBelow = afterFork != null && !isForkStation(afterFork) && afterFork.branch !== null;

  const loop = getLoop(line);
  const items: RailItem[] = [];
  if (loop) {
    let loopDone = false;
    for (const station of shown) {
      if (isLoopStation(station)) {
        if (!loopDone) {
          items.push({ type: 'loop' });
          loopDone = true;
        }
        continue;
      }
      items.push({ type: 'station', station, hideTop: false, hideBottom: false });
    }
  } else {
    shown.forEach((station, i) => {
      if (isForkStation(station)) {
        items.push({ type: 'fork', station });
      } else {
        items.push({
          type: 'station',
          station,
          hideBottom: !branchesBelow && i === forkIndex - 1,
          hideTop: branchesBelow && i === forkIndex + 1,
        });
      }
    });
  }

  return {
    items,
    branches,
    selectedBranch,
    branchesBelow,
    loop,
    realStations: line.stations.filter((s) => !isForkStation(s)),
  };
}

/** Position dans le rail de la station portant ce nom (le bloc boucle si elle en fait partie) ; -1 si absente. */
export function railIndexOf(items: RailItem[], loop: LoopData | null, name: string): number {
  const inLoop = loop?.groups.some((g) => g.stations.some((s) => s.name === name)) ?? false;

  return items.findIndex((item) => (item.type === 'loop' ? inLoop : item.station.name === name));
}

/** La branche à afficher pour voir cette station (null si elle est sur le tronc ou absente). */
export function branchOfStation(line: LineDetail, name: string): string | null {
  const keys = getBranches(line.stations).map((b) => b.key);
  const branch = line.stations.find((s) => s.name === name)?.branch ?? null;

  return branch !== null && keys.includes(branch) ? branch : null;
}

/** Descendre à cette station termine-t-il la ligne (toutes les autres sont déjà visitées) ? */
export function completesLine(
  realStations: Station[],
  entries: ProgressEntry[],
  stationId: number,
): boolean {
  const visited = new Set(entries.filter((e) => e.stopped).map((e) => e.stationId));

  return (
    realStations.some((s) => s.id === stationId) &&
    realStations.every((s) => s.id === stationId || visited.has(s.id))
  );
}
