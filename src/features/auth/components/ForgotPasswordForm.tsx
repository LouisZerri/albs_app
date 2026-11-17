import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useLanguage, useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { useThemeColors } from '@/shared/theme';
import { Button, Input, Text, TextLink } from '@/shared/ui';

import { useForgotPassword } from '../hooks';
import { createEmailSchema } from '../types';

/** Formulaire « mot de passe oublié » : envoie l'email de réinitialisation. */
export function ForgotPasswordForm() {
  const colors = useThemeColors();
  const router = useRouter();
  const { mutate, isPending, isSuccess, error } = useForgotPassword();
  const { t } = useTranslation('auth');
  const { language } = useLanguage();
  // Reconstruit à chaque changement de langue : les messages de validation la suivent.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const emailSchema = useMemo(() => createEmailSchema(), [language]);

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string>();

  const submit = () => {
    const parsed = emailSchema.safeParse(email.trim());
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    mutate(parsed.data);
  };

  if (isSuccess) {
    return (
      <View className="gap-7">
        <View className="items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-accentSoft">
            <Ionicons name="mail-outline" size={30} color={colors.accent} />
          </View>
          <View className="items-center gap-1.5">
            <Text variant="subtitle" className="text-center">
              {t('forgot.sentTitle')}
            </Text>
            <Text variant="muted" className="text-center">
              {t('forgot.sentBody')}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <Button
            label={t('forgot.gotCode')}
            onPress={() =>
              router.push({ pathname: '/reset-password', params: { email: email.trim() } })
            }
          />
          <View className="items-center">
            <TextLink label={t('forgot.backToLogin')} onPress={() => router.replace('/login')} />
          </View>
        </View>
      </View>
    );
  }

  const apiMessage = error
    ? error instanceof ApiError
      ? error.message
      : t('forgot.failed')
    : null;

  return (
    <View className="gap-6">
      <Input
        label={t('fields.email')}
        value={email}
        onChangeText={setEmail}
        error={fieldError}
        placeholder={t('fields.emailPlaceholder')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label={t('forgot.submit')} onPress={submit} loading={isPending} />

      <View className="flex-row items-center justify-center gap-1.5">
        <Text variant="muted">{t('forgot.remember')}</Text>
        <TextLink label={t('actions.signIn')} onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
