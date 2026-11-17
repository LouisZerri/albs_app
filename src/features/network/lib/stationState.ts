import type { ProgressEntry } from '../types';

export type StationState = 'visited' | 'passed' | 'todo';

/** Déduit l'état d'une station : descendu (visited) > passé (passed) > à faire (todo). */
export function stationState(entry: ProgressEntry | undefined): StationState {
  if (entry?.stopped) return 'visited';
  if (entry?.passed) return 'passed';
  return 'todo';
}

/** Construit une map stationId → entrée de progression. */
export function progressMap(entries: ProgressEntry[]): Map<number, ProgressEntry> {
  return new Map(entries.map((e) => [e.stationId, e]));
}

/** Les drapeaux envoyés à l'API pour chaque état (descendu implique passé). */
export const STATE_FLAGS: Record<StationState, { passed: boolean; stopped: boolean }> = {
  todo: { passed: false, stopped: false },
  passed: { passed: true, stopped: false },
  visited: { passed: true, stopped: true },
};

/** État suivant au tap sur le rail : à faire → passé → descendu → à faire. */
export function nextState(current: StationState): StationState {
  return current === 'todo' ? 'passed' : current === 'passed' ? 'visited' : 'todo';
}
