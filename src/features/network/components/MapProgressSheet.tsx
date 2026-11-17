import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { BottomSheet, Chip, ProgressBar, Text } from '@/shared/ui';

import type { LineGeo, NetworkStats } from '../types';
import { LineBadge } from './LineBadge';
import { MapLineSelector } from './MapLineSelector';

/** Hauteur du panneau réduit : poignée + résumé + bande de lignes. */
export const MAP_SHEET_COLLAPSED = 172;

type Props = {
  /** Hauteur de la zone de carte (mesurée), pour borner le panneau agrandi. */
  areaHeight: number;
  /** Progression de l'utilisateur ; absente tant qu'elle charge (le résumé est alors masqué). */
  stats: NetworkStats | undefined;
  lines: LineGeo[];
  lineId: number | null;
  onToggleLine: (lineId: number) => void;
  remainingOnly: boolean;
  onRemainingOnlyChange: (remainingOnly: boolean) => void;
};

/**
 * Panneau de progression de la carte : % global, filtre « Ce qu'il me reste », choix d'une ligne ;
 * agrandi, il détaille la complétion ligne par ligne. UI pure (seul l'état ouvert/fermé est local).
 */
export function MapProgressSheet({
  areaHeight,
  stats,
  lines,
  lineId,
  onToggleLine,
  remainingOnly,
  onRemainingOnlyChange,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <BottomSheet
      collapsedHeight={MAP_SHEET_COLLAPSED}
      expandedHeight={Math.max(MAP_SHEET_COLLAPSED, Math.min(areaHeight - 90, 560))}
      expanded={expanded}
      onExpandedChange={setExpanded}
      header={
        <View>
          <View className="flex-row items-center gap-3 px-4 pb-3">
            <View className="flex-1">
              {stats ? (
                <>
                  <Text variant="subtitle" color="accent">
                    {stats.percent}% du réseau
                  </Text>
                  <Text variant="muted">
                    {stats.stations.visited} / {stats.stations.total} stations visitées
                  </Text>
                </>
              ) : null}
            </View>
            <Chip
              label="Ce qu’il me reste"
              active={remainingOnly}
              onPress={() => onRemainingOnlyChange(!remainingOnly)}
            />
          </View>
          <MapLineSelector lines={lines} selectedId={lineId} onToggle={onToggleLine} />
        </View>
      }
    >
      <ScrollView contentContainerClassName="gap-1 px-4 pb-6" showsVerticalScrollIndicator={false}>
        {(stats?.lines ?? []).map((line) => (
          <Pressable
            key={line.id}
            onPress={() => onToggleLine(line.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: line.id === lineId }}
            accessibilityLabel={`Ligne ${line.number}, ${line.visited} stations sur ${line.total}`}
            // Estompe les autres lignes quand une est mise en évidence (comme sur la carte).
            style={{ opacity: lineId !== null && line.id !== lineId ? 0.4 : 1 }}
            className="h-11 flex-row items-center gap-3 active:opacity-60"
          >
            <LineBadge
              number={line.number}
              color={line.color}
              textColor={line.textColor}
              size={28}
            />
            <View className="flex-1">
              <ProgressBar percent={line.percent} color={line.color} />
            </View>
            <Text variant="muted" className="w-14 text-right">
              {line.visited}/{line.total}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}
