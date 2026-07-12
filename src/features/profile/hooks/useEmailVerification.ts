import { useMutation } from '@tanstack/react-query';

import { resendVerification, verifyEmail } from '@/features/auth/api';
import { ME_QUERY_KEY } from '@/features/auth/store';
import { queryClient } from '@/shared/lib';

/** Renvoie un nouveau code de vérification à l'adresse du compte. */
export function useResendVerification() {
  return useMutation({ mutationFn: () => resendVerification() });
}

/** Confirme l'adresse via le code, puis rafraîchit le profil (isEmailVerified). */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (input: { email: string; code: string }) => verifyEmail(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
  });
}
