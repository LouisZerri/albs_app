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
