/** Rang de l'utilisateur, calculé sur son engagement total (stations passées + descendues). */
export type Rank = { label: string; icon: string; bg: string; fg: string };

const RANKS: { min: number; rank: Rank }[] = [
  { min: 500, rank: { label: 'Expert', icon: '👑', bg: '#FEF3C7', fg: '#92400E' } }, // or
  { min: 200, rank: { label: 'Voyageur', icon: '✈️', bg: '#EDE9FE', fg: '#5B21B6' } }, // violet
  { min: 50, rank: { label: 'Explorateur', icon: '🧭', bg: '#DBEAFE', fg: '#1E40AF' } }, // bleu
  { min: 0, rank: { label: 'Débutant', icon: '🌱', bg: '#DCFCE7', fg: '#166534' } }, // vert
];

/** Renvoie le rang correspondant à un niveau d'engagement (passé + descendu). */
export function rankFor(engagement: number): Rank {
  return (RANKS.find((r) => engagement >= r.min) ?? RANKS[RANKS.length - 1]).rank;
}
