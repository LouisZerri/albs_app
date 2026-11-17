import { Pressable, View } from 'react-native';

import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { Branch } from '../lib/forkModel';

type Props = {
  branches: Branch[];
  selected: string | null;
  onSelect: (key: string) => void;
  lineColor: string;
};

/** Choix de la branche à une fourche, façon switch iOS. UI pure. */
export function BranchSelector({ branches, selected, onSelect, lineColor }: Props) {
  return (
    <View className="flex-row rounded-card bg-hair p-1">
      {branches.map((branch) => {
        const active = branch.key === selected;
        return (
          <Pressable
            key={branch.key}
            onPress={() => onSelect(branch.key)}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl px-3 py-2',
              active && 'bg-surface',
            )}
          >
            {active ? (
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lineColor }} />
            ) : null}
            <Text variant={active ? 'body' : 'muted'} numberOfLines={1} className="shrink">
              {branch.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
