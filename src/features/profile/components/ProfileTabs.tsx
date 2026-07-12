import { Pressable, View } from 'react-native';

import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

export type ProfileTab = 'badges' | 'progression';

const TABS: { key: ProfileTab; label: string; icon: string }[] = [
  { key: 'badges', label: 'Badges', icon: '🏆' },
  { key: 'progression', label: 'Progression', icon: '🚇' },
];

type Props = {
  tab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  counts: Record<ProfileTab, string>;
};

/** Onglets du profil (Badges / Progression) avec chip compteur. UI pure. */
export function ProfileTabs({ tab, onChange, counts }: Props) {
  return (
    <View className="flex-row gap-1.5 rounded-pill bg-hair p-1.5">
      {TABS.map((t) => {
        const active = t.key === tab;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-2 rounded-pill py-2.5',
              active ? 'bg-surface' : 'active:opacity-60',
            )}
            style={active ? SHADOW : undefined}>
            <Text className="text-base">{t.icon}</Text>
            <Text
              variant={active ? 'subtitle' : 'muted'}
              color={active ? 'accent' : undefined}
              className="text-sm">
              {t.label}
            </Text>
            <View
              className={cn(
                'rounded-pill px-2 py-0.5',
                active ? 'bg-accentSoft' : 'bg-surface/70',
              )}>
              <Text variant="label" color={active ? 'accent' : undefined} className="text-[10px]">
                {counts[t.key]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
