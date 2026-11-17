import { AuthScreenLayout, LoginForm } from '@/features/auth/components';
import { useTranslation } from '@/i18n';

export default function LoginScreen() {
  const { t } = useTranslation('auth');

  return (
    <AuthScreenLayout title={t('login.title')} subtitle={t('login.subtitle')}>
      <LoginForm />
    </AuthScreenLayout>
  );
}
