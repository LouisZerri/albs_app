import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { i18n } from '@/i18n/instance';

import { ApiError, NETWORK_ERROR_STATUS } from './ApiError';

/** Créée à la demande : le message suit la langue active. */
const offlineError = () => new ApiError(i18n.t('errors.offline'), NETWORK_ERROR_STATUS);

/**
 * Ajuste l'état d'une requête pour une app qui doit vivre sans réseau :
 *
 * - **Des données sont là** (même anciennes, même si le dernier rafraîchissement a échoué) → on
 *   les montre. Un réseau instable ne doit jamais remplacer un écran utile par une erreur.
 * - **Rien en mémoire et requête en pause faute de réseau** → c'est une erreur « pas de
 *   connexion », pas un chargement : sinon l'écran tournerait sans fin sous terre.
 * - Sinon, l'état d'origine.
 *
 * Garantie conservée pour les écrans : ni en chargement ni en erreur ⇒ `data` est défini.
 */
export function withOfflineState<TData>(
  result: UseQueryResult<TData, Error>,
): UseQueryResult<TData, Error> {
  if (result.data !== undefined) {
    return {
      ...result,
      status: 'success',
      isPending: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    } as UseQueryResult<TData, Error>;
  }

  if (result.fetchStatus === 'paused') {
    return {
      ...result,
      status: 'error',
      isPending: false,
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: offlineError(),
    } as UseQueryResult<TData, Error>;
  }

  return result;
}

/** `useQuery` de l'app : mêmes options, état adapté au hors-ligne (voir `withOfflineState`). */
export function useAppQuery<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, Error, TData, TQueryKey>): UseQueryResult<TData, Error> {
  return withOfflineState(useQuery(options));
}
