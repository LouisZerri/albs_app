import { useMutation } from '@tanstack/react-query';

import { forgotPassword } from '../api';

/** Demande l'envoi d'un email de réinitialisation. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}
