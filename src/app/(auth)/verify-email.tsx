import { useLocalSearchParams } from 'expo-router';

import { AuthScreenLayout, VerifyEmailForm } from '@/features/auth/components';

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <AuthScreenLayout
      title="Confirme ton adresse"
      subtitle="Saisis le code à 6 chiffres qu’on vient de t’envoyer par email.">
      <VerifyEmailForm initialEmail={email ?? ''} />
    </AuthScreenLayout>
  );
}
