import { Pressable, View } from 'react-native';

import { LANGUAGES, useLanguage, useTranslation } from '@/i18n';
import { cn } from '@/shared/utils/cn';

import { Text } from './Text';

/** Choix de la langue (FR / EN), jumeau de l'interrupteur clair / sombre. Le choix est mémorisé. */
export function LanguageSwitch() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('a11y.language')}
      className="flex-row gap-1 rounded-pill bg-hair p-1"
    >
      {LANGUAGES.map((option) => {
        const active = option === language;
        return (
          <Pressable
            key={option}
            onPress={() => setLanguage(option)}
            hitSlop={6}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            className={cn(
              'h-8 w-9 items-center justify-center rounded-full active:opacity-70',
              active && 'bg-surface',
            )}
          >
            <Text
              variant="muted"
              color={active ? 'accent' : 'muted'}
              className="font-semibold"
              style={{ fontSize: 12 }}
            >
              {option.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
