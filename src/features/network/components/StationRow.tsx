import { Pressable, type PressableProps, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { fonts } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { StationState } from '../lib/stationState';
import type { Station } from '../types';
import { BonplansLink } from './BonplansLink';
import { CorrespondenceDots } from './CorrespondenceDots';
import { StationNode } from './StationNode';

type Props = {
  station: Station;
  state: StationState;
  color: string;
  textColor: string | null;
  isFirst: boolean;
  isLast: boolean;
  onPress: PressableProps['onPress'];
  hideBottom?: boolean;
  hideTop?: boolean;
  /** Ouvre les bons plans de la station (lien affiché une fois la station visitée). */
  onOpenBonplans?: () => void;
  /** Station visée par une recherche : fond violet clair pour la repérer. */
  highlighted?: boolean;
};

/** Une station dans le rail. Toute la ligne est tappable (cible large). */
export function StationRow({
  station,
  state,
  color,
  textColor,
  isFirst,
  isLast,
  onPress,
  hideBottom,
  hideTop,
  onOpenBonplans,
  highlighted,
}: Props) {
  const { t } = useTranslation('network');
  const isTerminus = isFirst || isLast;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center pr-4 active:bg-hair/40',
        highlighted && 'bg-accentSoft/60',
      )}
      accessibilityRole="button"
      accessibilityState={{ checked: state === 'visited' }}
    >
      <StationNode
        state={state}
        color={color}
        textColor={textColor}
        isTerminus={isTerminus}
        isFirst={isFirst}
        isLast={isLast}
        hideBottom={hideBottom}
        hideTop={hideTop}
      />

      <View className="flex-1 flex-row items-center gap-2">
        <Text
          variant={isTerminus ? 'subtitle' : 'body'}
          numberOfLines={1}
          className="shrink"
          style={isTerminus ? { fontFamily: fonts.extrabold } : undefined}
        >
          {station.name}
        </Text>
        <CorrespondenceDots items={station.correspondences} />
        {state === 'passed' ? (
          <Text variant="label" color="passed">
            {t('states.passed')}
          </Text>
        ) : null}
      </View>

      {/* Récompense de la visite : on est descendu ici → on propose les adresses autour. */}
      {state === 'visited' && station.bonplanCount > 0 && onOpenBonplans ? (
        <BonplansLink count={station.bonplanCount} onPress={onOpenBonplans} />
      ) : null}
    </Pressable>
  );
}
