import { useMutation } from '@tanstack/react-query';

import { login } from '../api';
import { useAuth } from '../store';
import type { LoginInput } from '../types';

/** Connexion : appelle l'API puis ouvre la session (stockage tokens + hydratation user). */
export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (tokens) => signIn(tokens),
  });
}
