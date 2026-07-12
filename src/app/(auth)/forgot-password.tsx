import { AuthScreenLayout, ForgotPasswordForm } from '@/features/auth/components';

export default function ForgotPasswordScreen() {
  return (
    <AuthScreenLayout
      title="Mot de passe oublié"
      subtitle="Indique ton e-mail, on t’envoie un lien pour en choisir un nouveau.">
      <ForgotPasswordForm />
    </AuthScreenLayout>
  );
}
