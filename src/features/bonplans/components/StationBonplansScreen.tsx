import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, type FlatList, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { StationFact } from '@/features/network/components';
import { BottomSheet, ErrorState, FloatingAction, Screen } from '@/shared/ui';

import { useBonplanActions, useStationBonplans } from '../hooks';
import { categoriesOf } from '../lib/categories';
import { sortByDistance, type NearbyBonplan } from '../lib/distance';
import { BonplanList } from './BonplanList';
import { BonplanMap } from './BonplanMap';
import { CategoryChips } from './CategoryChips';
import { StationBonplansHeader } from './StationBonplansHeader';

/**
 * Écran d'une station : carte plein écran + panneau coulissant (filtres par catégorie et liste des
 * bons plans, du plus proche au plus loin).
 */
export function StationBonplansScreen({ id }: { id: number }) {
  const colors = useThemeColors();
  const { t } = useTranslation('bonplans');
  const router = useRouter();
  const { data, error, isPending, isError, refetch } = useStationBonplans(id);
  const { toggleFavorite, openDirections } = useBonplanActions();
  const listRef = useRef<FlatList<NearbyBonplan>>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  /** Hauteur disponible sous l'en-tête (mesurée) : sert à dimensionner le panneau. */
  const [areaHeight, setAreaHeight] = useState(0);

  const station = data?.station;
  const stationPoint = useMemo(
    () =>
      station && station.lat !== null && station.lng !== null
        ? { latitude: station.lat, longitude: station.lng }
        : null,
    [station],
  );
  const all = useMemo(
    () => sortByDistance(data?.bonplans ?? [], stationPoint),
    [data, stationPoint],
  );

  if (isPending) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} />
        </View>
      </Screen>
    );
  }

  if (isError || !station) {
    return (
      <Screen>
        <ErrorState
          error={error}
          message={t('station.loadError')}
          onRetry={() => refetch()}
          onBack={() => router.back()}
        />
      </Screen>
    );
  }

  const visible = category === null ? all : all.filter((b) => b.category === category);

  const selectFromMap = (bonplanId: number) => {
    setSelectedId(bonplanId);
    const index = visible.findIndex((b) => b.id === bonplanId);
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
    }
  };

  // Panneau : réduit = moitié basse (la carte reste visible), agrandi = presque tout l'écran.
  const collapsedHeight = Math.max(280, Math.round(areaHeight * 0.5));
  const expandedHeight = Math.max(collapsedHeight, areaHeight - 56);

  return (
    <View className="flex-1 bg-bg">
      <StationBonplansHeader station={station} count={all.length} onBack={() => router.back()} />

      <View
        className="flex-1 overflow-hidden"
        onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}
      >
        {stationPoint ? (
          <View className="absolute inset-0">
            <BonplanMap
              station={stationPoint}
              // Couleur de la ligne si la station n'en a qu'une ; neutre pour une correspondance.
              stationColor={station.lines.length === 1 ? station.lines[0].color : colors.ink}
              bonplans={visible}
              selectedId={selectedId}
              bottomInset={collapsedHeight}
              onSelect={selectFromMap}
            />
          </View>
        ) : null}

        {areaHeight > 0 ? (
          <BottomSheet
            collapsedHeight={collapsedHeight}
            expandedHeight={expandedHeight}
            expanded={expanded}
            onExpandedChange={setExpanded}
            header={
              <View>
                {station.fact ? <StationFact fact={station.fact} className="mx-5" /> : null}
                <CategoryChips
                  categories={categoriesOf(all)}
                  selected={category}
                  onSelect={(next) => {
                    setCategory(next);
                    setSelectedId(null);
                  }}
                />
              </View>
            }
          >
            <BonplanList
              listRef={listRef}
              bonplans={visible}
              selectedId={selectedId}
              // Réduit, le bas du panneau est hors écran : on compense pour atteindre les derniers
              // bons plans. Les 112 pt gardent le dernier lisible au-dessus du bouton flottant.
              bottomPadding={112 + (expanded ? 0 : expandedHeight - collapsedHeight)}
              // Réduit le panneau : la carte, recentrée sur le lieu, redevient visible.
              onSelect={(bonplan) => {
                setSelectedId(bonplan.id);
                setExpanded(false);
              }}
              onToggleFavorite={toggleFavorite}
              onDirections={openDirections}
            />
          </BottomSheet>
        ) : null}

        <FloatingAction
          icon="add"
          label={t('station.suggest')}
          onPress={() => router.push(`/bonplans/${id}/new`)}
        />
      </View>
    </View>
  );
}
