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

import { onSessionExpired, queryClient, tokenStore } from '@/shared/lib';

import { fetchMe } from '../api';
import type { AuthTokens, User } from '../types';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

/**
 * `offline` : un compte est mémorisé sur ce téléphone mais son profil n'a jamais pu être chargé
 * (premier lancement sans réseau après une réinstallation, cache vidé…). On ne peut ni entrer dans
 * l'app ni conclure que la session est invalide : il faut attendre le réseau.
 */
type Status = 'loading' | 'authenticated' | 'unauthenticated' | 'offline';

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
    // Vide TOUT le cache : progression, favoris… appartiennent à ce compte et ne doivent pas
    // réapparaître si un autre compte se connecte ensuite sur le même téléphone.
    queryClient.clear();
  }, []);

  // Session terminée côté serveur (refresh token refusé) → retour à la connexion.
  useEffect(() => onSessionExpired(() => void signOut()), [signOut]);

  // ici le statut passe seul à « unauthenticated » via `meFailed` dans deriveStatus.
  const user = meQuery.data ?? null;

  const status: Status = deriveStatus({
    bootstrapped,
    hasToken,
    hasUser: Boolean(user),
    meFailed: meQuery.isError,
    mePaused: meQuery.fetchStatus === 'paused',
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
  mePaused: boolean;
}): Status {
  if (!s.bootstrapped) return 'loading';
  if (!s.hasToken) return 'unauthenticated';
  if (s.hasUser) return 'authenticated';
  if (s.meFailed) return 'unauthenticated';
  // Requête en pause = pas de réseau, et rien en cache pour ce compte.
  return s.mePaused ? 'offline' : 'loading';
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un <AuthProvider>.');
  }
  return ctx;
}
