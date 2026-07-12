/**
 * Erreur d'API normalisée, calquée sur le format `{ message, status }`
 * renvoyé par l'ApiExceptionListener de l'API Symfony.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
