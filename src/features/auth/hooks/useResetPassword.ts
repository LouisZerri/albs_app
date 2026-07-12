import { useMutation } from '@tanstack/react-query';

import { resetPassword, type ResetPasswordInput } from '../api';

/** Réinitialise le mot de passe via le code reçu par email. */
export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(input),
  });
}
