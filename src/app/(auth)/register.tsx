import { AuthScreenLayout, RegisterForm } from '@/features/auth/components';

export default function RegisterScreen() {
  return (
    <AuthScreenLayout title="Bienvenue à bord" subtitle="Crée ton compte pour commencer à explorer le réseau.">
      <RegisterForm />
    </AuthScreenLayout>
  );
}
