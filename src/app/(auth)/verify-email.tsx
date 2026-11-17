import { useLocalSearchParams } from 'expo-router';

import { AuthScreenLayout, VerifyEmailForm } from '@/features/auth/components';
import { useTranslation } from '@/i18n';

export default function VerifyEmailScreen() {
  const { t } = useTranslation('auth');
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <AuthScreenLayout title={t('verify.title')} subtitle={t('verify.subtitle')}>
      <VerifyEmailForm initialEmail={email ?? ''} />
    </AuthScreenLayout>
  );
}
