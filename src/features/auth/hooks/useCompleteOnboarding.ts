import { useMutation } from '@tanstack/react-query';

import { completeOnboarding } from '../api';

/**
 * Termine l'onboarding (appel API). L'application du résultat au cache `me`
 * (qui déclenche la bascule vers l'app) est laissée à l'appelant, pour pouvoir
 * afficher une célébration avant la redirection.
 */
export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: completeOnboarding,
  });
}
