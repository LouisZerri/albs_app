import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { fonts, useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import { categoryLabel } from '../lib/categories';
import { isCommunity, walkLabel, type NearbyBonplan } from '../lib/distance';

type Props = {
  bonplan: NearbyBonplan;
  selected?: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  /** Affiche « près de <station> » (liste des favoris, hors contexte d'une station). */
  showStation?: boolean;
  /** Absent si le bon plan n'est pas géolocalisé. */
  onDirections?: () => void;
};

/** Carte d'un bon plan : icône, nom, distance à pied, favori et « Y aller ». UI pure. */
export function BonplanCard({
  bonplan,
  selected,
  showStation,
  onPress,
  onToggleFavorite,
  onDirections,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('bonplans');
  const community = isCommunity(bonplan);
  const source = community
    ? t('card.proposedBy', { name: bonplan.author ?? t('card.aMember') })
    : bonplan.source === 'osm'
      ? 'OpenStreetMap'
      : null;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row gap-3 rounded-card border bg-surface p-3 active:opacity-70',
        selected ? 'border-accent' : 'border-hair',
      )}
    >
      <Text style={{ fontSize: 24, lineHeight: 30 }}>{bonplan.categoryIcon}</Text>

      <View className="flex-1 gap-1">
        <Text variant="subtitle" numberOfLines={2}>
          {bonplan.title}
        </Text>
        <Text variant="muted" numberOfLines={1}>
          {categoryLabel(bonplan.category)}
          {bonplan.distance !== null ? ` · ${walkLabel(bonplan.distance)}` : ''}
          {showStation ? ` · ${t('card.nearStation', { name: bonplan.stationName })}` : ''}
        </Text>
        {bonplan.address ? (
          <Text variant="muted" numberOfLines={1}>
            {bonplan.address}
          </Text>
        ) : null}
        {bonplan.description ? <Text numberOfLines={3}>{bonplan.description}</Text> : null}

        <View className="mt-1 flex-row items-center justify-between gap-2">
          <Text
            variant="muted"
            // Recommandation d'un membre : mise en avant (accent) par rapport à l'import automatique.
            color={community ? 'accent' : undefined}
            numberOfLines={1}
            className="flex-1"
            style={{ fontSize: 12 }}
          >
            {source ?? ''}
          </Text>
          {onDirections ? (
            <Pressable
              onPress={onDirections}
              accessibilityRole="button"
              accessibilityLabel={t('card.directionsA11y', { name: bonplan.title })}
              className="h-11 flex-row items-center gap-1.5 rounded-full bg-accent px-4 active:opacity-70"
            >
              <Ionicons name="navigate" size={15} color={colors.white} />
              <Text variant="muted" color="white" style={{ fontFamily: fonts.semibold }}>
                {t('card.directions')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Pressable
        onPress={onToggleFavorite}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{ selected: bonplan.isFavorite }}
        accessibilityLabel={bonplan.isFavorite ? t('card.removeFavorite') : t('card.addFavorite')}
        className="h-9 w-9 items-center justify-center"
      >
        <Ionicons
          name={bonplan.isFavorite ? 'star' : 'star-outline'}
          size={24}
          color={bonplan.isFavorite ? colors.passed : colors.muted}
        />
      </Pressable>
    </Pressable>
  );
}
