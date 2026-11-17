import { config } from './config';
import { tokenStore } from './tokenStore';

type Listener = () => void;

const expiredListeners = new Set<Listener>();

/**
 * S'abonner à la fin de session (refresh token refusé ou absent) : l'app doit alors renvoyer
 * à la connexion. Renvoie la fonction de désabonnement.
 */
export function onSessionExpired(listener: Listener): () => void {
  expiredListeners.add(listener);
  return () => {
    expiredListeners.delete(listener);
  };
}

let inFlight: Promise<boolean> | null = null;

/**
 * Renouvelle le JWT (1 h) avec le refresh token (30 j). Renvoie true si un nouveau JWT est stocké.
 *
 * Un seul renouvellement à la fois : le refresh token est à usage unique (rotation côté API), donc
 * deux appels simultanés s'invalideraient l'un l'autre. Les requêtes concurrentes attendent le même.
 */
export function refreshSession(): Promise<boolean> {
  inFlight ??= renew().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

async function renew(): Promise<boolean> {
  const refreshToken = await tokenStore.getRefresh();
  if (!refreshToken) {
    await expire();
    return false;
  }

  // Appel direct (pas `apiFetch`) : ce module est utilisé PAR `apiFetch`.
  // Une panne réseau lève ici et remonte telle quelle : la session n'est pas perdue pour autant.
  const response = await fetch(`${config.apiBaseUrl}/api/token/refresh`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (response.status === 401 || response.status === 403) {
    // Refresh token expiré, révoqué, ou compte banni : la session est réellement terminée.
    await expire();
    return false;
  }
  if (!response.ok) {
    return false; // Erreur serveur passagère : on garde les tokens, on réessaiera.
  }

  const data: unknown = await response.json().catch(() => null);
  if (
    !data ||
    typeof data !== 'object' ||
    !('token' in data) ||
    typeof data.token !== 'string' ||
    !('refresh_token' in data) ||
    typeof data.refresh_token !== 'string'
  ) {
    return false;
  }

  await tokenStore.save(data.token, data.refresh_token);
  return true;
}

async function expire(): Promise<void> {
  await tokenStore.clear();
  expiredListeners.forEach((listener) => listener());
}
