import { useMutation } from '@tanstack/react-query';

import { register } from '../api';
import type { RegisterInput } from '../types';

/**
 * Inscription : crée le compte (statut `pending`) et renvoie l'utilisateur.
 * Ne connecte pas automatiquement — l'écran redirigera vers le login.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
  });
}
