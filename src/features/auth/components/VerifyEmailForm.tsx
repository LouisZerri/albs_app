import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useLanguage, useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { Button, Input, Text, TextLink, useToast } from '@/shared/ui';

import { useRequestVerificationCode, useVerifyEmail } from '../hooks';
import { createEmailSchema } from '../types';

type FieldErrors = { email?: string; code?: string };

/** Formulaire de confirmation d'adresse email via code à 6 chiffres. */
export function VerifyEmailForm({ initialEmail = '' }: { initialEmail?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { mutate, isPending, error } = useVerifyEmail();
  const resend = useRequestVerificationCode();
  const { t } = useTranslation('auth');
  const { language } = useLanguage();
  // Reconstruit à chaque changement de langue : les messages de validation la suivent.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const emailSchema = useMemo(() => createEmailSchema(), [language]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const errors: FieldErrors = {};
    if (!emailSchema.safeParse(email.trim()).success) {
      errors.email = t('validation.emailInvalid');
    }
    if (!/^\d{6}$/.test(code)) errors.code = t('validation.codeLength');

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    mutate(
      { email: email.trim(), code },
      {
        onSuccess: () => {
          toast.show(t('verify.success'), 'success');
          router.replace('/login');
        },
      },
    );
  };

  const sendNewCode = () => {
    if (!emailSchema.safeParse(email.trim()).success) {
      return setFieldErrors({ email: t('validation.emailInvalid') });
    }
    setFieldErrors({});
    resend.mutate(email.trim(), {
      onSuccess: () => toast.show(t('verify.resent'), 'success'),
      onError: (e) => toast.show(e instanceof ApiError ? e.message : t('verify.failed'), 'error'),
    });
  };

  const apiMessage = error
    ? error instanceof ApiError
      ? error.message
      : t('verify.failed')
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
      </View>

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label={t('verify.submit')} onPress={submit} loading={isPending} />

      <View className="items-center gap-3">
        <TextLink label={t('verify.resend')} onPress={sendNewCode} />
        <TextLink label={t('verify.backToLogin')} onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
