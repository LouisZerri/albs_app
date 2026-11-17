import { ScrollView } from 'react-native';

import { Chip } from '@/shared/ui';

import type { CategoryOption } from '../lib/categories';

type Props = {
  categories: CategoryOption[];
  /** Catégorie active, ou null pour « Tout ». */
  selected: string | null;
  onSelect: (category: string | null) => void;
};

/** Filtres par catégorie, en bande horizontale défilante. UI pure. */
export function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // Un ScrollView rétrécit par défaut : sans ça, la liste en dessous rogne la bande de filtres.
      style={{ flexGrow: 0, flexShrink: 0 }}
      contentContainerClassName="gap-2 px-5 py-3"
    >
      <Chip label="Tout" active={selected === null} onPress={() => onSelect(null)} />
      {categories.map((c) => (
        <Chip
          key={c.key}
          label={`${c.icon} ${c.label}`}
          active={c.key === selected}
          onPress={() => onSelect(c.key)}
        />
      ))}
    </ScrollView>
  );
}
