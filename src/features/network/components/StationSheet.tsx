import { Pressable, View } from 'react-native';

import { colors, fonts } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { StationState } from '../lib/stationState';
import type { MapStation } from '../types';
import { BonplansLink } from './BonplansLink';
import { LineBadge } from './LineBadge';

const STATES: { key: StationState; label: string; color: string }[] = [
  { key: 'todo', label: 'À faire', color: '#C2C9D4' },
  { key: 'passed', label: 'Passé', color: colors.passed },
  { key: 'visited', label: 'Descendu', color: colors.visited },
];

type Props = {
  station: MapStation;
  state: StationState;
  onSetState: (target: StationState) => void;
  onOpenBonplans: () => void;
};

/** Carte flottante d'une station sélectionnée sur la carte : nom + sélecteur d'état. UI pure. */
export function StationSheet({ station, state, onSetState, onOpenBonplans }: Props) {
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
              style={active ? { backgroundColor: `${s.color}22` } : undefined}>
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
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
