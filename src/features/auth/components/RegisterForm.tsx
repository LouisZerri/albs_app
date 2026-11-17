import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, View } from 'react-native';

import { useLanguage, useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { Button, Checkbox, Input, Text, TextLink } from '@/shared/ui';

import { useRegister } from '../hooks';
import { createRegisterSchema } from '../types';
import { PasswordRules } from './PasswordRules';

type FieldErrors = {
  email?: string;
  username?: string;
  plainPassword?: string;
  confirm?: string;
  terms?: string;
};

/** Formulaire d'inscription : crée le compte puis renvoie vers le login. */
export function RegisterForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useRegister();
  const { t } = useTranslation('auth');
  const { language } = useLanguage();
  // Reconstruit à chaque changement de langue : les messages de validation la suivent.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const registerSchema = useMemo(() => createRegisterSchema(), [language]);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const parsed = registerSchema.safeParse({
      email: email.trim(),
      username: username.trim(),
      plainPassword: password,
      acceptedTerms,
    });

    const errors: FieldErrors = {};
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      errors.email = f.email?.[0];
      errors.username = f.username?.[0];
      errors.plainPassword = f.plainPassword?.[0];
      errors.terms = f.acceptedTerms?.[0];
    }
    if (password !== confirm) errors.confirm = t('validation.passwordMismatch');

    setFieldErrors(errors);
    if (!parsed.success || errors.confirm) return;

    mutate(parsed.data, {
      onSuccess: (_data, variables) => {
        router.replace({ pathname: '/verify-email', params: { email: variables.email } });
      },
    });
  };

  const apiMessage = error
    ? error instanceof ApiError
      ? error.message
      : t('register.failed')
    : null;

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
        />
        <Input
          label={t('fields.username')}
          value={username}
          onChangeText={setUsername}
          error={fieldErrors.username}
          placeholder={t('fields.usernamePlaceholder')}
          autoCapitalize="none"
          autoComplete="username"
          maxLength={30}
        />
        <View className="gap-2">
          <Input
            label={t('fields.password')}
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.plainPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {password.length > 0 ? <PasswordRules value={password} /> : null}
        </View>
        <Input
          label={t('fields.confirmPassword')}
          value={confirm}
          onChangeText={setConfirm}
          error={fieldErrors.confirm}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />
      </View>

      <View className="gap-1.5">
        <Checkbox checked={acceptedTerms} onChange={setAcceptedTerms}>
          <View className="flex-row flex-wrap items-center gap-x-1">
            <Text variant="muted">{t('register.acceptTerms')}</Text>
            <TextLink
              label={t('register.termsLink')}
              onPress={() => Linking.openURL(t('register.termsUrl'))}
            />
          </View>
        </Checkbox>
        {fieldErrors.terms ? (
          <Text variant="muted" color="danger">
            {fieldErrors.terms}
          </Text>
        ) : null}
      </View>

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label={t('register.submit')} onPress={submit} loading={isPending} />

      <View className="flex-row items-center justify-center gap-1.5">
        <Text variant="muted">{t('register.hasAccount')}</Text>
        <TextLink label={t('actions.signIn')} onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
