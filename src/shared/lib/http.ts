import { ApiError } from './ApiError';
import { config } from './config';
import { tokenStore } from './tokenStore';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Options = {
  method?: Method;
  /** Corps JSON (sérialisé automatiquement). */
  body?: unknown;
  /** Joindre le JWT au header Authorization (défaut : true). */
  auth?: boolean;
  signal?: AbortSignal;
};

/**
 * Appel à l'API. Renvoie le JSON typé, ou lève une `ApiError` { message, status }.
 * NB : le refresh auto sur 401 sera branché avec la feature auth.
 */
export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = options;

  // FormData (upload de fichier) : on laisse fetch poser le Content-Type + boundary.
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined && !isForm) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = await tokenStore.getAccess();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    signal,
  });

  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  const data = raw ? safeJsonParse(raw) : null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Une erreur est survenue. Réessaie plus tard.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
