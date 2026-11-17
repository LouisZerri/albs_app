import { Pressable, View } from 'react-native';

import { fonts, useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { StationState } from '../lib/stationState';
import type { MapStation } from '../types';
import { BonplansLink } from './BonplansLink';
import { LineBadge } from './LineBadge';
import { StationFact } from './StationFact';

const STATES: { key: StationState; label: string }[] = [
  { key: 'todo', label: 'À faire' },
  { key: 'passed', label: 'Passé' },
  { key: 'visited', label: 'Descendu' },
];

type Props = {
  station: MapStation;
  state: StationState;
  onSetState: (target: StationState) => void;
  onOpenBonplans: () => void;
};

/** Carte flottante d'une station sélectionnée sur la carte : nom + sélecteur d'état. UI pure. */
export function StationSheet({ station, state, onSetState, onOpenBonplans }: Props) {
  const colors = useThemeColors();
  return (
    <View
      className="absolute inset-x-3 bottom-3 gap-3 rounded-card bg-surface p-4"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}>
      <View className="flex-row flex-wrap items-center gap-2">
        <Text variant="subtitle">{station.name}</Text>
        {station.lines.map((c) => (
          <LineBadge
            key={c.lineId}
            number={c.number}
            color={c.color}
            textColor={c.textColor}
            size={22}
          />
        ))}
      </View>

      {station.fact ? <StationFact fact={station.fact} /> : null}

      <View className="flex-row gap-2">
        {STATES.map((s) => {
          const active = s.key === state;
          return (
            <Pressable
              key={s.key}
              onPress={() => onSetState(s.key)}
              className={cn(
                'flex-1 flex-row items-center justify-center gap-2 rounded-card border py-2.5',
                active ? 'border-transparent' : 'border-hair',
              )}
              style={active ? { backgroundColor: `${colors[s.key]}22` } : undefined}>
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[s.key] }} />
              <Text
                variant="muted"
                style={active ? { color: colors.ink, fontFamily: fonts.semibold } : undefined}>
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {station.bonplanCount > 0 ? (
        <View className="-mb-2 -mt-1 items-start">
          <BonplansLink count={station.bonplanCount} onPress={onOpenBonplans} variant="full" />
        </View>
      ) : null}
    </View>
  );
}
