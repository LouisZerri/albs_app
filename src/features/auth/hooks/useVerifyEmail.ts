import { useMutation } from '@tanstack/react-query';

import { verifyEmail } from '../api';

/** Confirme l'adresse email via le code reçu par email. */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (input: { email: string; code: string }) => verifyEmail(input),
  });
}
