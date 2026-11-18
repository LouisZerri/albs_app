import { i18n } from '@/i18n/instance';

import { ApiError, fetchOrNetworkError } from './ApiError';
import { config } from './config';
import { refreshSession } from './session';
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
 *
 * Si le JWT a expiré (401), il est renouvelé avec le refresh token puis la requête est rejouée
 * une fois, de façon transparente. Si le renouvellement est refusé, la session se termine
 * (cf. `onSessionExpired`) et l'erreur 401 remonte.
 */
export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const { auth = true } = options;

  const response = await send(path, options);
  if (response.status === 401 && auth && (await refreshSession())) {
    return parseResponse<T>(await send(path, options));
  }

  return parseResponse<T>(response);
}

/** Envoie la requête avec le JWT courant (relu à chaque envoi : il peut venir d'être renouvelé). */
async function send(path: string, options: Options): Promise<Response> {
  const { method = 'GET', body, auth = true, signal } = options;

  // FormData (upload de fichier) : on laisse fetch poser le Content-Type + boundary.
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    // L'API répond dans cette langue (contenu éditorial, badges, messages d'erreur).
    'Accept-Language': i18n.language,
  };
  if (body !== undefined && !isForm) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = await tokenStore.getAccess();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return fetchOrNetworkError(`${config.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    signal,
  });
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  const data = raw ? safeJsonParse(raw) : null;

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data) ?? i18n.t('errors.generic'),
      response.status,
      extractString(data, 'field'),
      extractString(data, 'reason'),
    );
  }

  return data as T;
}

/**
 * Deux formats d'erreur coexistent côté API : `{ message }` (contrôleurs) et
 * `{ violations: [{ message }] }` (validation API Platform, ex. register).
 */
function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  if ('message' in data && typeof data.message === 'string') {
    return data.message;
  }

  if ('violations' in data && Array.isArray(data.violations)) {
    const messages = data.violations
      .map((v: unknown) =>
        v && typeof v === 'object' && 'message' in v && typeof v.message === 'string'
          ? v.message
          : null,
      )
      .filter((m): m is string => m !== null);
    if (messages.length > 0) return messages.join('\n');
  }

  return null;
}

/** Précision facultative de l'erreur : `field` (champ du formulaire visé) ou `reason` (motif du refus). */
function extractString(data: unknown, key: 'field' | 'reason'): string | undefined {
  const value = data && typeof data === 'object' ? (data as Record<string, unknown>)[key] : null;
  return typeof value === 'string' ? value : undefined;
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
