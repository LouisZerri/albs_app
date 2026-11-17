import { useState } from 'react';

/**
 * État du « tirer pour rafraîchir » : l'indicateur ne tourne que pour un geste de l'utilisateur.
 *
 * Ne PAS brancher `isRefetching` sur `RefreshControl` : les rafraîchissements automatiques (après
 * un cochage, au retour du réseau…) feraient surgir l'indicateur tout seul, et sur iOS il reste
 * figé quand cela arrive pendant que l'écran est masqué par un autre.
 *
 * @param refetchers les rechargements à lancer (ex. `query.refetch`)
 */
export function usePullToRefresh(...refetchers: (() => Promise<unknown>)[]) {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    void Promise.allSettled(refetchers.map((refetch) => refetch())).finally(() =>
      setRefreshing(false),
    );
  };

  return { refreshing, refresh };
}
