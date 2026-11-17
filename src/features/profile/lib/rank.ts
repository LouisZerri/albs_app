import { i18n } from '@/i18n/instance';

/** Rang de l'utilisateur, selon le nombre de stations (physiques) où il est descendu. */
export type Rank = { label: string; icon: string; bg: string; fg: string };

type RankKey = 'expert' | 'traveller' | 'explorer' | 'beginner';
type RankDef = { min: number; key: RankKey; icon: string; bg: string; fg: string };

const RANKS: RankDef[] = [
  { min: 250, key: 'expert', icon: '👑', bg: '#FEF3C7', fg: '#92400E' }, // or
  { min: 100, key: 'traveller', icon: '✈️', bg: '#EDE9FE', fg: '#5B21B6' }, // violet
  { min: 25, key: 'explorer', icon: '🧭', bg: '#DBEAFE', fg: '#1E40AF' }, // bleu
  { min: 0, key: 'beginner', icon: '🌱', bg: '#DCFCE7', fg: '#166534' }, // vert
];

/** Le nom du rang est lu à l'appel, dans la langue active. */
const toRank = ({ key, icon, bg, fg }: RankDef): Rank => ({
  label: i18n.t(`profile:ranks.${key}`),
  icon,
  bg,
  fg,
});

/** Renvoie le rang correspondant à un nombre de stations visitées. */
export function rankFor(visited: number): Rank {
  return toRank(RANKS.find((r) => visited >= r.min) ?? RANKS[RANKS.length - 1]);
}

export type NextRank = {
  rank: Rank;
  /** Stations restant à visiter pour l'atteindre. */
  remaining: number;
  /** Avancement dans le palier courant (0–100). */
  percent: number;
};

/** Le rang suivant et le chemin restant ; null si le rang maximal est atteint. */
export function nextRankFor(visited: number): NextRank | null {
  const currentIndex = RANKS.findIndex((r) => visited >= r.min);
  if (currentIndex <= 0) return null; // 0 = déjà au rang maximal

  const floor = RANKS[currentIndex].min;
  const next = RANKS[currentIndex - 1];

  return {
    rank: toRank(next),
    remaining: next.min - visited,
    percent: Math.round(((visited - floor) / (next.min - floor)) * 100),
  };
}
