import { QueryCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from './ApiError';
import { tokenStore } from './tokenStore';

export const queryClient = new QueryClient({
  // Un 401 sur n'importe quelle requête = JWT invalide/expiré : on purge les tokens.
  // (Le refresh auto sur 401 sera branché plus tard avec la feature auth.)
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        void tokenStore.clear();
      }
    },
  }),
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
