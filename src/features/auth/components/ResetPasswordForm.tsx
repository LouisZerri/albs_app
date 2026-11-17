import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useLanguage, useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { Button, Input, Text, TextLink, useToast } from '@/shared/ui';

import { useResetPassword } from '../hooks';
import { isPasswordValid } from '../lib/passwordRules';
import { createEmailSchema } from '../types';
import { PasswordRules } from './PasswordRules';

type FieldErrors = { email?: string; code?: string; password?: string; confirm?: string };

/** Formulaire de réinitialisation : email + code reçu + nouveau mot de passe. */
export function ResetPasswordForm({ initialEmail = '' }: { initialEmail?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { mutate, isPending, error } = useResetPassword();
  const { t } = useTranslation('auth');
  const { language } = useLanguage();
  // Reconstruit à chaque changement de langue : les messages de validation la suivent.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const emailSchema = useMemo(() => createEmailSchema(), [language]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const errors: FieldErrors = {};
    if (!emailSchema.safeParse(email.trim()).success) {
      errors.email = t('validation.emailInvalid');
    }
    if (!/^\d{6}$/.test(code)) errors.code = t('validation.codeLength');
    if (!isPasswordValid(password)) errors.password = t('validation.passwordRules');
    if (password !== confirm) errors.confirm = t('validation.passwordMismatch');

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    mutate(
      { email: email.trim(), code, password },
      {
        onSuccess: () => {
          toast.show(t('reset.success'), 'success');
          router.replace('/login');
        },
      },
    );
  };

  const apiMessage = error ? (error instanceof ApiError ? error.message : t('reset.failed')) : null;

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
          textContentType="emailAddress"
        />
        <Input
          label={t('fields.code')}
          value={code}
          onChangeText={setCode}
          error={fieldErrors.code}
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
        />
        <View className="gap-2">
          <Input
            label={t('fields.newPassword')}
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
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

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label={t('reset.submit')} onPress={submit} loading={isPending} />

      <View className="flex-row items-center justify-center gap-1.5">
        <Text variant="muted">{t('reset.backTo')}</Text>
        <TextLink label={t('reset.loginLink')} onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
