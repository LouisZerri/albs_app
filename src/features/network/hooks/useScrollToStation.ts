import { useRef, type RefObject } from 'react';
import type { FlatList } from 'react-native';

/**
 * Défile jusqu'à une position de la liste à l'ouverture de l'écran (station venue de la
 * recherche) et l'amène dans le tiers haut. Une seule fois, quand la liste a pris sa taille.
 *
 * @param index position visée, ou -1 s'il n'y a rien à atteindre
 */
export function useScrollToStation<T>(listRef: RefObject<FlatList<T> | null>, index: number) {
  const done = useRef(false);
  const retries = useRef(0);

  const scroll = () => listRef.current?.scrollToIndex({ index, viewPosition: 0.3, animated: true });

  return {
    /** À brancher sur `onContentSizeChange`. Léger délai : les lignes doivent être mesurées. */
    onContentSizeChange: () => {
      if (done.current || index < 0) return;
      done.current = true;
      setTimeout(scroll, 80);
    },
    /** Cible pas encore mesurée (hauteurs variables : fourche, boucle) → on réessaie, 3 fois au plus. */
    onScrollToIndexFailed: () => {
      if (retries.current < 3) {
        retries.current += 1;
        setTimeout(scroll, 150);
      }
    },
  };
}
