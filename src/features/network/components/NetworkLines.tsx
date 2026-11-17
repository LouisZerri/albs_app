import { Fragment } from 'react';
import { Polyline } from 'react-native-maps';

import { useThemeColors } from '@/shared/theme';

import type { LineGeo } from '../types';

type Props = {
  lines: LineGeo[];
  /** Ligne mise en avant (trait épais, les autres estompées) ; null = toutes à égalité. */
  highlightedId: number | null;
};

/** Les tracés des lignes sur la carte. À placer dans une `MapView`. UI pure. */
export function NetworkLines({ lines, highlightedId }: Props) {
  const colors = useThemeColors();
  // La ligne mise en avant est dessinée en dernier, donc par-dessus les autres.
  const ordered =
    highlightedId === null
      ? lines
      : [...lines].sort((a, b) => Number(a.id === highlightedId) - Number(b.id === highlightedId));

  return (
    // Sur iOS l'ordre de dessin est l'ordre d'ajout (`zIndex` est ignoré) : changer de ligne mise en
    // avant remonte tous les tracés, dans le bon ordre.
    <Fragment key={highlightedId ?? 'all'}>
      {ordered.flatMap((line) => {
        const highlighted = line.id === highlightedId;
        const dim = highlightedId !== null && !highlighted;
        return (line.geometry ?? []).map((segment, i) => (
          <Polyline
            key={`${line.id}-${i}`}
            coordinates={segment.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))}
            strokeColor={dim ? colors.todo : line.color}
            strokeWidth={highlighted ? 5 : dim ? 2 : 3}
            zIndex={highlighted ? 3 : 1}
          />
        ));
      })}
    </Fragment>
  );
}
