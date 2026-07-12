import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

import { colors, fonts } from '@/shared/theme';
import { cn } from '@/shared/utils/cn';

import { Text } from './Text';

type Props = TextInputProps & {
  label?: string;
  /** Message d'erreur ; passe le champ en rouge quand présent. */
  error?: string;
  className?: string;
};

/** Champ de saisie du design system. Gère l'œil afficher/masquer si `secureTextEntry`. */
export function Input({ label, error, className, secureTextEntry, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const border = error ? 'border-danger' : focused ? 'border-accent' : 'border-hair';

  return (
    <View className={cn('gap-1.5', className)}>
      {label ? <Text variant="label">{label}</Text> : null}

      <View className={cn('flex-row items-center rounded-card border bg-surface px-4', border)}>
        <TextInput
          placeholderTextColor={colors.muted}
          secureTextEntry={hidden}
          className="flex-1 text-ink"
          style={{
            fontFamily: fonts.regular,
            fontSize: 16,
            paddingVertical: 12,
            includeFontPadding: false, // Android : supprime le padding interne de la police
            textAlignVertical: 'center',
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text variant="muted" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
