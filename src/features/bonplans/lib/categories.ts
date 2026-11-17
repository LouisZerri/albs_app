import { i18n } from '@/i18n/instance';

import { BONPLAN_CATEGORY_KEYS, type Bonplan } from '../types';

export type CategoryKey = (typeof BONPLAN_CATEGORY_KEYS)[number];
export type CategoryOption = { key: string; icon: string; label: string };

/** Icônes des catégories de bons plans (identiques au web) ; les libellés sont dans les traductions. */
const CATEGORY_ICONS: Record<CategoryKey, string> = {
  restaurant: '🍽️',
  bar: '🍺',
  cafe: '☕',
  monument: '🏛️',
  shop: '🛍️',
  culture: '🎭',
  park: '🌳',
  other: '📍',
};

const isCategoryKey = (category: string): category is CategoryKey =>
  (BONPLAN_CATEGORY_KEYS as readonly string[]).includes(category);

/** Toutes les catégories, dans l'ordre d'affichage (choix du formulaire), dans la langue active. */
export function allCategories(): CategoryOption[] {
  return BONPLAN_CATEGORY_KEYS.map((key) => ({
    key,
    icon: CATEGORY_ICONS[key],
    label: categoryLabel(key),
  }));
}

/** Libellé d'une catégorie ; catégorie inconnue → « Autres ». */
export function categoryLabel(category: string): string {
  return i18n.t(`bonplans:categories.${isCategoryKey(category) ? category : 'other'}`);
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
