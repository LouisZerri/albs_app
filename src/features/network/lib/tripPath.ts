import type { ProgressEntry, Station } from '../types';
import { isForkStation } from './forkModel';
import { isLoopStation } from './loopModel';

/** Ce qu'il faut de la station pour calculer un trajet. */
type Stop = Pick<Station, 'id' | 'position' | 'branch'>;

/** Un cochage à envoyer : l'état voulu d'une station. */
export type TripChange = { stationId: number; passed: boolean; stopped: boolean };

const RETURN_BRANCH = 'retour';
const byPosition = (a: Stop, b: Stop) => a.position - b.position;

/**
 * Qui est relié à qui sur la ligne (id → ids atteignables en un arrêt).
 *
 * - Tronc : stations consécutives, dans les deux sens.
 * - Fourche (7, 13) : chaque branche est une suite de stations, raccordée à la station-fourche
 *   par son extrémité la plus proche.
 * - Boucle (10, 7bis) : les stations à sens unique ne se parcourent que dans LEUR sens —
 *   « aller » dans l'ordre des positions, « retour » dans l'ordre inverse.
 */
function buildLinks(stops: readonly Stop[]): Map<number, number[]> {
  const links = new Map<number, number[]>(stops.map((s) => [s.id, []]));
  const oneWay = (from: Stop, to: Stop) => links.get(from.id)?.push(to.id);
  const bothWays = (a: Stop, b: Stop) => {
    oneWay(a, b);
    oneWay(b, a);
  };

  const loop = stops.filter(isLoopStation);
  const trunk = stops.filter((s) => s.branch === null || isForkStation(s)).sort(byPosition);

  for (let i = 1; i < trunk.length; i++) {
    const [before, after] = [trunk[i - 1], trunk[i]];
    const between = loop
      .filter((s) => s.position > before.position && s.position < after.position)
      .sort(byPosition);
    if (between.length === 0) {
      bothWays(before, after);
      continue;
    }
    const outbound = between.filter((s) => s.branch !== RETURN_BRANCH);
    const inbound = between.filter((s) => s.branch === RETURN_BRANCH).reverse();
    [before, ...outbound, after].forEach((s, k, chain) => k > 0 && oneWay(chain[k - 1], s));
    [after, ...inbound, before].forEach((s, k, chain) => k > 0 && oneWay(chain[k - 1], s));
  }

  const fork = stops.find(isForkStation);
  const branchKeys = new Set(
    stops
      .filter((s) => s.branch !== null && !isForkStation(s) && !isLoopStation(s))
      .map((s) => s.branch),
  );
  for (const key of branchKeys) {
    const branch = stops.filter((s) => s.branch === key).sort(byPosition);
    branch.forEach((s, k) => k > 0 && bothWays(branch[k - 1], s));
    if (fork) {
      const nearest = branch.reduce((best, s) =>
        Math.abs(s.position - fork.position) < Math.abs(best.position - fork.position) ? s : best,
      );
      bothWays(nearest, fork);
    }
  }

  return links;
}

/**
 * Les stations parcourues pour aller de `fromId` à `toId` sur une ligne, départ et arrivée
 * compris, dans l'ordre du trajet. `null` si le trajet est impossible (même station, station
 * inconnue). Parcours en largeur : le plus court chemin, en respectant les sens uniques.
 */
export function tripPath<T extends Stop>(
  stations: readonly T[],
  fromId: number,
  toId: number,
): T[] | null {
  const byId = new Map(stations.map((s) => [s.id, s]));
  if (fromId === toId || !byId.has(fromId) || !byId.has(toId)) return null;

  const links = buildLinks(stations);
  const cameFrom = new Map<number, number | null>([[fromId, null]]);
  const queue = [fromId];
  while (queue.length > 0) {
    const current = queue.shift() as number;
    if (current === toId) break;
    for (const next of links.get(current) ?? []) {
      if (!cameFrom.has(next)) {
        cameFrom.set(next, current);
        queue.push(next);
      }
    }
  }
  if (!cameFrom.has(toId)) return null;

  const path: T[] = [];
  for (let id: number | null = toId; id !== null; id = cameFrom.get(id) ?? null) {
    path.unshift(byId.get(id) as T);
  }
  return path;
}

/**
 * Ce qu'un trajet coche : « descendu » au départ et à l'arrivée (on y a posé le pied), « passé »
 * entre les deux. Jamais de retour en arrière : une station déjà « descendu » le reste. Seuls les
 * changements réels sont renvoyés.
 */
export function tripChanges(
  path: readonly Pick<Station, 'id'>[],
  entries: readonly ProgressEntry[],
): TripChange[] {
  const current = new Map(entries.map((e) => [e.stationId, e]));

  return path.flatMap((station, index): TripChange[] => {
    const entry = current.get(station.id);
    const endpoint = index === 0 || index === path.length - 1;
    if (entry?.stopped || (!endpoint && entry?.passed)) return [];

    return [{ stationId: station.id, passed: true, stopped: endpoint }];
  });
}

/** De quoi défaire un trajet : l'état d'avant de chaque station qu'il a modifiée. */
export function tripUndo(
  changes: readonly TripChange[],
  entriesBefore: readonly ProgressEntry[],
): TripChange[] {
  const before = new Map(entriesBefore.map((e) => [e.stationId, e]));

  return changes.map(({ stationId }) => ({
    stationId,
    passed: before.get(stationId)?.passed ?? false,
    stopped: before.get(stationId)?.stopped ?? false,
  }));
}
