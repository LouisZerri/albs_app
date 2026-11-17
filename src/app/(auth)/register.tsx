import { AuthScreenLayout, RegisterForm } from '@/features/auth/components';
import { useTranslation } from '@/i18n';

export default function RegisterScreen() {
  const { t } = useTranslation('auth');

  return (
    <AuthScreenLayout title={t('register.title')} subtitle={t('register.subtitle')}>
      <RegisterForm />
    </AuthScreenLayout>
  );
}
