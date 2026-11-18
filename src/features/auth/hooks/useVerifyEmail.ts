import { useMutation } from '@tanstack/react-query';

import { requestVerificationCode, verifyEmail } from '../api';

/** Confirme l'adresse email via le code reçu par email. */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (input: { email: string; code: string }) => verifyEmail(input),
  });
}

/** Redemande un code de confirmation pour une adresse (avant connexion). */
export function useRequestVerificationCode() {
  return useMutation({ mutationFn: (email: string) => requestVerificationCode(email) });
}
