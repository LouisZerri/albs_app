import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors, useThemeMode, type ThemeMode } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

const OPTIONS: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'light', icon: 'sunny' },
  { mode: 'dark', icon: 'moon' },
];

/** Interrupteur clair / sombre (soleil / lune). Un tap n'importe où bascule ; le choix est mémorisé. */
export function ThemeSwitch() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { mode, setMode } = useThemeMode();
  const dark = mode === 'dark';

  return (
    <Pressable
      onPress={() => setMode(dark ? 'light' : 'dark')}
      hitSlop={6}
      accessibilityRole="switch"
      accessibilityState={{ checked: dark }}
      accessibilityLabel={t('a11y.darkMode')}
      className="flex-row gap-1 rounded-pill bg-hair p-1 active:opacity-70"
    >
      {OPTIONS.map((option) => {
        const active = option.mode === mode;
        return (
          <View
            key={option.mode}
            className={cn(
              'h-8 w-8 items-center justify-center rounded-full',
              active && 'bg-surface',
            )}
          >
            <Ionicons name={option.icon} size={17} color={active ? colors.accent : colors.muted} />
          </View>
        );
      })}
    </Pressable>
  );
}
