import { type PressableProps, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';

import type { Branch } from '../lib/forkModel';
import type { StationState } from '../lib/stationState';
import type { Station } from '../types';
import { BranchSelector } from './BranchSelector';
import { StationRow } from './StationRow';

const BLOCK_H = 76;

type Props = {
  station: Station;
  state: StationState;
  color: string;
  textColor: string | null;
  isFirst: boolean;
  isLast: boolean;
  onPress: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  highlighted?: boolean;
  onOpenBonplans?: () => void;
  branches: Branch[];
  selected: string | null;
  onSelect: (key: string) => void;
  /** Les branches sont-elles affichées en dessous de la fourche (ex. ligne 7) ? */
  branchesBelow: boolean;
};

/** Station-jonction : « la ligne se sépare » + switch, diapason symétrique orienté vers les branches. */
export function ForkRow({
  station,
  state,
  color,
  textColor,
  isFirst,
  isLast,
  onPress,
  onLongPress,
  highlighted,
  onOpenBonplans,
  branches,
  selected,
  onSelect,
  branchesBelow,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');
  // Coloré seulement si la fourche est cochée (comme le reste du rail).
  const railColor = state === 'todo' ? colors.hair : color;

  const block = (
    <View className="flex-row" style={{ height: BLOCK_H }}>
      <View style={{ width: 52 }}>
        <Svg width={52} height={BLOCK_H}>
          {branchesBelow ? (
            <>
              <Path
                d={`M26 0 L26 ${BLOCK_H - 30}`}
                stroke={railColor}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <Path
                d={`M26 ${BLOCK_H - 30} Q18 ${BLOCK_H - 16} 18 ${BLOCK_H - 12} L18 ${BLOCK_H}`}
                stroke={railColor}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d={`M26 ${BLOCK_H - 30} Q34 ${BLOCK_H - 16} 34 ${BLOCK_H - 12} L34 ${BLOCK_H}`}
                stroke={railColor}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <Path
                d="M18 0 L18 12 Q18 26 26 30"
                stroke={railColor}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M34 0 L34 12 Q34 26 26 30"
                stroke={railColor}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d={`M26 30 L26 ${BLOCK_H}`}
                stroke={railColor}
                strokeWidth={4}
                strokeLinecap="round"
              />
            </>
          )}
        </Svg>
      </View>

      <View className="flex-1 justify-center gap-2 pr-4">
        <Text variant="muted">{t('rail.forkHint')}</Text>
        <BranchSelector
          branches={branches}
          selected={selected}
          onSelect={onSelect}
          lineColor={color}
        />
      </View>
    </View>
  );

  const node = (
    <StationRow
      station={station}
      state={state}
      color={color}
      textColor={textColor}
      isFirst={isFirst}
      isLast={isLast}
      onPress={onPress}
      onLongPress={onLongPress}
      highlighted={highlighted}
      onOpenBonplans={onOpenBonplans}
    />
  );

  return (
    <View>
      {branchesBelow ? node : block}
      {branchesBelow ? block : node}
    </View>
  );
}
