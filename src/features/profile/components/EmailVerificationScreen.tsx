import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useAuth } from '@/features/auth/store';
import { useTranslation } from '@/i18n';
import { Button, Input, SubScreen, Text, TextLink, useToast } from '@/shared/ui';

import { useResendVerification, useVerifyEmail } from '../hooks';

/** Écran de vérification d'email depuis le profil : envoi du code + saisie. */
export function EmailVerificationScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  const toast = useToast();
  const resend = useResendVerification();
  const verify = useVerifyEmail();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sendCode = () => {
    resend.mutate(undefined, {
      onSuccess: () => toast.show(t('verifyEmail.sent'), 'success'),
      onError: (e) => toast.show(e.message, 'error'),
    });
  };

  const submit = () => {
    if (!/^\d{6}$/.test(code)) return setError(t('verifyEmail.codeInvalid'));
    setError(null);
    verify.mutate(
      { email: user?.email ?? '', code },
      {
        onSuccess: () => {
          toast.show(t('verifyEmail.confirmed'), 'success');
          router.back();
        },
        onError: (e) => setError(e.message),
      },
    );
  };

  return (
    <SubScreen title={t('verifyEmail.title')} onBack={() => router.back()}>
      <View className="gap-5 py-3">
        <Text variant="muted">
          {t('verifyEmail.introBefore')}
          <Text variant="muted" color="ink">
            {user?.email ?? ''}
          </Text>
          {t('verifyEmail.introAfter')}
        </Text>

        <Button
          label={t('verifyEmail.send')}
          variant="secondary"
          loading={resend.isPending}
          onPress={sendCode}
        />

        <Input
          label={t('verifyEmail.codeLabel')}
          value={code}
          onChangeText={setCode}
          error={error ?? undefined}
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
        />

        <Button label={t('verifyEmail.confirm')} loading={verify.isPending} onPress={submit} />

        <View className="items-center">
          <TextLink label={t('verifyEmail.resend')} onPress={sendCode} />
        </View>
      </View>
    </SubScreen>
  );
}
