import type { LineStats } from '../types';

/**
 * La ligne à reprendre : celle déjà entamée, pas encore terminée, la plus avancée.
 * null si aucune ligne n'est en cours (rien commencé, ou tout terminé).
 */
export function resumeLine(lines: LineStats[]): LineStats | null {
  const inProgress = lines.filter((l) => l.visited > 0 && l.visited < l.total);
  if (inProgress.length === 0) return null;

  return inProgress.reduce((best, line) => (line.percent > best.percent ? line : best));
}
