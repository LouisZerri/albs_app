import { AuthScreenLayout, LoginForm } from '@/features/auth/components';

export default function LoginScreen() {
  return (
    <AuthScreenLayout title="Content de te revoir" subtitle="Connecte-toi pour retrouver ta progression.">
      <LoginForm />
    </AuthScreenLayout>
  );
}
