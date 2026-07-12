import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { queryClient, tokenStore } from '@/shared/lib';

import { fetchMe } from '../api';
import type { AuthTokens, User } from '../types';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

type Status = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: Status;
  user: User | null;
  signIn: (tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  // Au démarrage : y a-t-il déjà un JWT dans le stockage sécurisé ?
  useEffect(() => {
    let active = true;
    tokenStore.getAccess().then((token) => {
      if (!active) return;
      setHasToken(Boolean(token));
      setBootstrapped(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // On hydrate l'utilisateur seulement si un token est présent.
  const meQuery = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: bootstrapped && hasToken,
    retry: false,
  });

  const signIn = useCallback(async (tokens: AuthTokens) => {
    await tokenStore.save(tokens.token, tokens.refresh_token);
    setHasToken(true);
    await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
  }, []);

  const signOut = useCallback(async () => {
    await tokenStore.clear();
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
  }, []);

  // ici le statut passe seul à « unauthenticated » via `meFailed` dans deriveStatus.
  const user = meQuery.data ?? null;

  const status: Status = deriveStatus({
    bootstrapped,
    hasToken,
    hasUser: Boolean(user),
    meFailed: meQuery.isError,
  });

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function deriveStatus(s: {
  bootstrapped: boolean;
  hasToken: boolean;
  hasUser: boolean;
  meFailed: boolean;
}): Status {
  if (!s.bootstrapped) return 'loading';
  if (!s.hasToken) return 'unauthenticated';
  if (s.hasUser) return 'authenticated';
  return s.meFailed ? 'unauthenticated' : 'loading';
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un <AuthProvider>.');
  }
  return ctx;
}
