import { BONPLAN_CATEGORY_KEYS, type Bonplan } from '../types';

export type CategoryKey = (typeof BONPLAN_CATEGORY_KEYS)[number];
export type CategoryOption = { key: string; icon: string; label: string };

/** Catégories de bons plans (libellés et icônes identiques au web). */
const CATEGORY_META: Record<CategoryKey, { icon: string; label: string }> = {
  restaurant: { icon: '🍽️', label: 'Restaurants' },
  bar: { icon: '🍺', label: 'Bars' },
  cafe: { icon: '☕', label: 'Cafés' },
  monument: { icon: '🏛️', label: 'Monuments' },
  shop: { icon: '🛍️', label: 'Boutiques' },
  culture: { icon: '🎭', label: 'Culture' },
  park: { icon: '🌳', label: 'Parcs & jardins' },
  other: { icon: '📍', label: 'Autres' },
};

/** Toutes les catégories, dans l'ordre d'affichage (choix du formulaire). */
export const ALL_CATEGORIES: CategoryOption[] = BONPLAN_CATEGORY_KEYS.map((key) => ({
  key,
  ...CATEGORY_META[key],
}));

/** Libellé d'une catégorie ; catégorie inconnue → « Autres ». */
export function categoryLabel(category: string): string {
  return (CATEGORY_META[category as CategoryKey] ?? CATEGORY_META.other).label;
}

/** Catégories réellement présentes dans la liste (dans l'ordre d'apparition), pour les filtres. */
export function categoriesOf(bonplans: Bonplan[]): CategoryOption[] {
  const seen = new Map<string, CategoryOption>();
  for (const b of bonplans) {
    if (!seen.has(b.category)) {
      seen.set(b.category, {
        key: b.category,
        icon: b.categoryIcon,
        label: categoryLabel(b.category),
      });
    }
  }
  return [...seen.values()];
}
