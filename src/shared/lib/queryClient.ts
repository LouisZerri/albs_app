import { QueryClient } from '@tanstack/react-query';

import { ApiError } from './ApiError';

// L'expiration du JWT est gérée dans `apiFetch` (renouvellement + rejeu) : rien à faire ici.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 s : évite les refetch trop agressifs sur mobile
      retry: (failureCount, error) => {
        // Inutile de réessayer sur une erreur client (4xx) : ça ne changera rien.
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
