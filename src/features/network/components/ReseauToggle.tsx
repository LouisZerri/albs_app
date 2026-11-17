import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

export type ReseauMode = 'list' | 'map';

const OPTIONS: { key: ReseauMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'list', icon: 'list' },
  { key: 'map', icon: 'map' },
];

/** Bascule Liste / Carte de l'onglet Réseau : pastille active en violet clair. UI pure. */
export function ReseauToggle({
  mode,
  onChange,
}: {
  mode: ReseauMode;
  onChange: (m: ReseauMode) => void;
}) {
  const colors = useThemeColors();
  const { t } = useTranslation('network');
  return (
    <View className="flex-row rounded-pill bg-hair p-1">
      {OPTIONS.map((option) => {
        const active = option.key === mode;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            className={cn(
              'flex-row items-center justify-center gap-1.5 rounded-pill px-6 py-2.5',
              active && 'bg-accentSoft',
            )}
          >
            <Ionicons name={option.icon} size={16} color={active ? colors.accent : colors.muted} />
            <Text
              variant={active ? 'subtitle' : 'muted'}
              color={active ? 'accent' : undefined}
              className="text-sm"
            >
              {t(`toggle.${option.key}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
