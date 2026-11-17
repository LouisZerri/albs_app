/**
 * Erreur d'API normalisée, calquée sur le format `{ message, status }`
 * renvoyé par l'ApiExceptionListener de l'API Symfony.
 */
/** Statut conventionnel d'une requête qui n'a jamais atteint le serveur (pas de réseau). */
export const NETWORK_ERROR_STATUS = 0;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** L'appel a-t-il échoué faute de connexion (et non à cause d'une réponse d'erreur du serveur) ? */
export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && error.status === NETWORK_ERROR_STATUS;
}

/**
 * `fetch` qui traduit une panne de réseau en `ApiError` de statut 0, pour que les écrans
 * puissent afficher « Pas de connexion ». Une requête annulée (AbortError) remonte telle quelle.
 */
export async function fetchOrNetworkError(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ApiError('Pas de connexion. Vérifie ton réseau et réessaie.', NETWORK_ERROR_STATUS);
  }
}
