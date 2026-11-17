import type { NetworkStats, Platform, ProgressEntry } from '../types';

type Toggle = { stationId: number; passed: boolean; stopped: boolean };

/**
 * Applique un cochage à la progression, SUR LE TÉLÉPHONE, avec les mêmes règles que le serveur
 * (StationProgressService) — indispensable hors ligne :
 * - la station cochée prend l'état demandé ;
 * - « descendu » se propage à tous les quais de même nom (correspondances) ; leur « passé » est conservé ;
 * - une station ni passée ni descendue n'a plus d'entrée.
 * Sans l'index des quais (`platforms` vide), seule la station cochée est modifiée.
 */
export function applyToggle(
  entries: ProgressEntry[],
  platforms: Platform[],
  toggle: Toggle,
): ProgressEntry[] {
  const byId = new Map(entries.map((e) => [e.stationId, e]));
  const set = (stationId: number, passed: boolean, stopped: boolean) => {
    if (passed || stopped)
      byId.set(stationId, { ...byId.get(stationId), stationId, passed, stopped });
    else byId.delete(stationId);
  };

  set(toggle.stationId, toggle.passed, toggle.stopped);

  const name = platforms.find((p) => p.id === toggle.stationId)?.name;
  if (name !== undefined) {
    for (const sibling of platforms) {
      if (sibling.name === name && sibling.id !== toggle.stationId) {
        set(sibling.id, byId.get(sibling.id)?.passed ?? false, toggle.stopped);
      }
    }
  }

  return [...byId.values()];
}

/**
 * Recalcule les compteurs à partir de la progression locale : par ligne (par quai) et global
 * (par station physique, c'est-à-dire par nom), comme le fait ProfileStatsService. Le reste des
 * statistiques du serveur (ligne à reprendre, défis) est conservé tel quel.
 */
export function deriveStats(
  stats: NetworkStats,
  platforms: Platform[],
  entries: ProgressEntry[],
): NetworkStats {
  if (platforms.length === 0) return stats;

  const byId = new Map(entries.map((e) => [e.stationId, e]));
  const percent = (part: number, total: number) =>
    total > 0 ? Math.round((part / total) * 100) : 0;

  const lines = stats.lines.map((line) => {
    const own = platforms.filter((p) => p.lineId === line.id);
    if (own.length === 0) return line;
    const visited = own.filter((p) => byId.get(p.id)?.stopped).length;
    const passed = own.filter((p) => byId.get(p.id)?.passed).length;
    return { ...line, total: own.length, visited, passed, percent: percent(visited, own.length) };
  });

  const names = new Set(platforms.map((p) => p.name));
  const visitedNames = new Set(platforms.filter((p) => byId.get(p.id)?.stopped).map((p) => p.name));

  return {
    ...stats,
    stations: {
      total: names.size,
      visited: visitedNames.size,
      passed: entries.filter((e) => e.passed).length,
    },
    percent: percent(visitedNames.size, names.size),
    lines,
  };
}
