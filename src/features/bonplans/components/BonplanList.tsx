import type { RefObject } from 'react';
import { FlatList } from 'react-native';

import { useTranslation } from '@/i18n';
import { Text } from '@/shared/ui';

import { coordinateOf, type NearbyBonplan } from '../lib/distance';
import { BonplanCard } from './BonplanCard';

type Props = {
  /** Réf. de la liste : permet au parent de faire défiler jusqu'à un bon plan (tap sur la carte). */
  listRef: RefObject<FlatList<NearbyBonplan> | null>;
  bonplans: NearbyBonplan[];
  selectedId: number | null;
  /** Marge basse (bouton flottant, partie du panneau hors écran…). */
  bottomPadding: number;
  onSelect: (bonplan: NearbyBonplan) => void;
  onToggleFavorite: (bonplan: NearbyBonplan) => void;
  onDirections: (bonplan: NearbyBonplan) => void;
};

/** Liste défilante des bons plans d'une station. UI pure. */
export function BonplanList({
  listRef,
  bonplans,
  selectedId,
  bottomPadding,
  onSelect,
  onToggleFavorite,
  onDirections,
}: Props) {
  const { t } = useTranslation('bonplans');

  return (
    <FlatList
      ref={listRef}
      data={bonplans}
      keyExtractor={(bonplan) => String(bonplan.id)}
      renderItem={({ item }) => (
        <BonplanCard
          bonplan={item}
          selected={item.id === selectedId}
          onPress={() => onSelect(item)}
          onToggleFavorite={() => onToggleFavorite(item)}
          onDirections={coordinateOf(item) ? () => onDirections(item) : undefined}
        />
      )}
      // Cartes de hauteur variable : si la cible n'est pas encore mesurée, on réessaie après rendu.
      onScrollToIndexFailed={({ index }) => {
        setTimeout(
          () => listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 }),
          150,
        );
      }}
      contentContainerClassName="grow gap-3 px-5"
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text variant="muted" className="py-6 text-center">
          {t('station.empty')}
        </Text>
      }
    />
  );
}
