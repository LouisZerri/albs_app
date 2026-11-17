import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTranslation } from '@/i18n';
import { fonts, useThemeColors } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/** Champ de recherche du design system : loupe + saisie + bouton effacer. UI pure. */
export function SearchInput({ value, onChangeText, placeholder, className, style }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  return (
    <View
      className={cn(
        'flex-row items-center gap-2.5 rounded-2xl border border-hair bg-surface px-4 py-3',
        className,
      )}
      style={style}
    >
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={placeholder}
        className="flex-1 text-ink"
        style={{ fontFamily: fonts.regular, fontSize: 15, padding: 0 }}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.clearSearch')}
        >
          <Ionicons name="close-circle" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
