/** Rang de l'utilisateur, selon le nombre de stations (physiques) où il est descendu. */
export type Rank = { label: string; icon: string; bg: string; fg: string };

const RANKS: { min: number; rank: Rank }[] = [
  { min: 250, rank: { label: 'Expert', icon: '👑', bg: '#FEF3C7', fg: '#92400E' } }, // or
  { min: 100, rank: { label: 'Voyageur', icon: '✈️', bg: '#EDE9FE', fg: '#5B21B6' } }, // violet
  { min: 25, rank: { label: 'Explorateur', icon: '🧭', bg: '#DBEAFE', fg: '#1E40AF' } }, // bleu
  { min: 0, rank: { label: 'Débutant', icon: '🌱', bg: '#DCFCE7', fg: '#166534' } }, // vert
];

/** Renvoie le rang correspondant à un nombre de stations visitées. */
export function rankFor(visited: number): Rank {
  return (RANKS.find((r) => visited >= r.min) ?? RANKS[RANKS.length - 1]).rank;
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
    rank: next.rank,
    remaining: next.min - visited,
    percent: Math.round(((visited - floor) / (next.min - floor)) * 100),
  };
}
