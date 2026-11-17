import { AuthScreenLayout, ForgotPasswordForm } from '@/features/auth/components';
import { useTranslation } from '@/i18n';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation('auth');

  return (
    <AuthScreenLayout title={t('forgot.title')} subtitle={t('forgot.subtitle')}>
      <ForgotPasswordForm />
    </AuthScreenLayout>
  );
}
