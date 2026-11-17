import { useLocalSearchParams } from 'expo-router';

import { AuthScreenLayout, ResetPasswordForm } from '@/features/auth/components';
import { useTranslation } from '@/i18n';

export default function ResetPasswordScreen() {
  const { t } = useTranslation('auth');
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <AuthScreenLayout title={t('reset.title')} subtitle={t('reset.subtitle')}>
      <ResetPasswordForm initialEmail={email ?? ''} />
    </AuthScreenLayout>
  );
}
