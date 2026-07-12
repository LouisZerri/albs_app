import { useLocalSearchParams } from 'expo-router';

import { AuthScreenLayout, ResetPasswordForm } from '@/features/auth/components';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <AuthScreenLayout
      title="Nouveau mot de passe"
      subtitle="Saisis le code reçu par email et choisis un nouveau mot de passe.">
      <ResetPasswordForm initialEmail={email ?? ''} />
    </AuthScreenLayout>
  );
}
