/** Normalise un texte pour la recherche : minuscules, sans accents, sans espaces autour. */
export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
