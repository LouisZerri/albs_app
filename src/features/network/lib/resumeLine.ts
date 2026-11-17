import type { LineStats, NetworkStats } from '../types';

/**
 * La ligne à reprendre : la dernière (non terminée) où l'utilisateur a coché une station.
 * Affichée en pied de la carte de progression. Le choix est fait par l'API (`resumeLineId`) ; null si rien n'est en cours.
 */
export function resumeLine(stats: NetworkStats): LineStats | null {
  return stats.lines.find((line) => line.id === stats.resumeLineId) ?? null;
}
