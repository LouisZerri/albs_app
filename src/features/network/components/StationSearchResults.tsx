import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { SkeletonList, Text } from '@/shared/ui';

import type { StationHit } from '../lib/stationSearch';
import { LineBadge } from './LineBadge';

type Props = {
  hits: StationHit[];
  isPending: boolean;
  isError: boolean;
  onSelect: (hit: StationHit) => void;
};

/** Résultats de la recherche de station : une entrée par station et par ligne. UI pure. */
export function StationSearchResults({ hits, isPending, isError, onSelect }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');
  if (isPending) {
    return <SkeletonList count={4} />;
  }

  return (
    <FlatList
      data={hits}
      keyExtractor={(hit) => hit.key}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          accessibilityRole="button"
          accessibilityLabel={t('search.resultA11y', { name: item.name, number: item.line.number })}
          className="flex-row items-center gap-3 rounded-card border border-hair bg-surface p-3 active:opacity-70"
        >
          <LineBadge
            number={item.line.number}
            color={item.line.color}
            textColor={item.line.textColor}
          />
          <View className="flex-1">
            <Text variant="subtitle" numberOfLines={1}>
              {item.name}
            </Text>
            <Text variant="muted">{t('lineName', { number: item.line.number })}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>
      )}
      contentContainerClassName="grow gap-3 px-5 pb-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center px-6">
          <Text variant="muted" className="text-center">
            {isError ? t('search.unavailable') : t('search.empty')}
          </Text>
        </View>
      }
    />
  );
}
