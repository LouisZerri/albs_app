import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useLanguage, useTranslation } from '@/i18n';
import { i18n } from '@/i18n/instance';
import { ApiError } from '@/shared/lib';
import { Button, Input, Text, TextLink } from '@/shared/ui';

import { useLogin } from '../hooks';
import { createLoginSchema } from '../types';

type FieldErrors = { email?: string; password?: string };

function messageFor(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message === 'Invalid credentials.'
      ? i18n.t('auth:login.invalidCredentials')
      : error.message;
  }
  return i18n.t('auth:login.failed');
}

/** Formulaire de connexion. La redirection après succès est gérée par le routing racine. */
export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const { t } = useTranslation('auth');
  const { language } = useLanguage();
  // Reconstruit à chaque changement de langue : les messages de validation la suivent.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loginSchema = useMemo(() => createLoginSchema(), [language]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const parsed = loginSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: f.email?.[0], password: f.password?.[0] });
      return;
    }
    setFieldErrors({});
    mutate(parsed.data);
  };

  const apiMessage = error ? messageFor(error) : null;

  return (
    <View className="gap-6">
      <View className="gap-4">
        <Input
          label={t('fields.email')}
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          placeholder={t('fields.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <Input
          label={t('fields.password')}
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </View>

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label={t('actions.signIn')} onPress={submit} loading={isPending} />

      <View className="items-center gap-3">
        <TextLink
          label={t('login.forgotPassword')}
          onPress={() => router.push('/forgot-password')}
        />
        <View className="flex-row items-center gap-1.5">
          <Text variant="muted">{t('login.noAccount')}</Text>
          <TextLink label={t('login.signUp')} onPress={() => router.push('/register')} />
        </View>
      </View>
    </View>
  );
}
