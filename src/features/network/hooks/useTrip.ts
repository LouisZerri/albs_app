import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useBadgeCelebration } from '@/features/badges';
import { useTranslation } from '@/i18n';
import { useToast } from '@/shared/ui';

import { tripChanges, tripPath, tripUndo, type TripChange } from '../lib/tripPath';
import type { ProgressEntry, Station } from '../types';
import { PROGRESS_KEY } from './useMyProgress';
import { useStationFeedback } from './useStationFeedback';
import { useToggleStation } from './useToggleStation';

/** Durée pendant laquelle un trajet validé peut être annulé. */
const UNDO_MS = 8000;

type Line = { number: string; stations: Station[] };

/**
 * « Trajet en un geste » sur une ligne : on choisit un départ puis une arrivée, et toutes les
 * stations parcourues sont cochées d'un coup (descendu aux deux bouts, passé entre).
 *
 * Chaque station passe par la file de cochages habituelle : le trajet fonctionne donc hors
 * ligne, et les règles (correspondances, badges, défis) s'appliquent sans rien de spécial.
 *
 * @param realStations les stations qui comptent pour terminer la ligne (toutes branches)
 */
export function useTrip(line: Line | undefined, realStations: Station[]) {
  const queryClient = useQueryClient();
  const toggle = useToggleStation();
  const feedback = useStationFeedback();
  const toast = useToast();
  const { celebrate } = useBadgeCelebration();
  const { t } = useTranslation('network');

  const [active, setActive] = useState(false);
  const [start, setStart] = useState<Station | null>(null);
  const [end, setEnd] = useState<Station | null>(null);
  /** De quoi défaire le dernier trajet validé, tant que le délai court. */
  const [undo, setUndo] = useState<TripChange[] | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (undoTimer.current && clearTimeout(undoTimer.current)), []);

  const path = useMemo(
    () => (line && start && end ? tripPath(line.stations, start.id, end.id) : null),
    [line, start, end],
  );
  const highlighted = useMemo(
    () => new Set(path ? path.map((s) => s.id) : start ? [start.id] : []),
    [path, start],
  );

  const reset = () => {
    setActive(false);
    setStart(null);
    setEnd(null);
  };
  const forgetUndo = () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo(null);
  };
  const entries = () => queryClient.getQueryData<ProgressEntry[]>(PROGRESS_KEY) ?? [];
  const send = (changes: TripChange[]) => {
    const at = new Date().toISOString();
    return changes.map((change) => toggle.mutateAsync({ ...change, at }));
  };

  /** Lance la saisie d'un trajet, depuis une station (appui long) ou sans départ (bouton). */
  const begin = (from?: Station) => {
    forgetUndo();
    setActive(true);
    setStart(from ?? null);
    setEnd(null);
    if (from) feedback('passed');
  };

  /** Tap sur une station pendant la saisie : le départ d'abord, puis l'arrivée. */
  const pick = (station: Station) => {
    if (!line) return;
    if (!start) {
      setStart(station);
      feedback('passed');
      return;
    }
    if (station.id === start.id) return;
    if (!tripPath(line.stations, start.id, station.id)) {
      toast.show(t('trip.impossible'), 'error');
      return;
    }
    setEnd(station);
    feedback('passed');
  };

  /** Coche tout le trajet. */
  const confirm = () => {
    if (!line || !path) return;
    const before = entries();
    const changes = tripChanges(path, before);
    reset();
    if (changes.length === 0) {
      toast.show(t('trip.nothingNew'), 'info');
      return;
    }

    feedback('visited');
    const wasComplete = realStations.every((s) =>
      before.some((e) => e.stationId === s.id && e.stopped),
    );
    const sent = send(changes);

    // Les cochages s'affichent tout de suite : on peut déjà savoir si la ligne est terminée.
    const visited = new Set(
      entries()
        .filter((e) => e.stopped)
        .map((e) => e.stationId),
    );
    if (!wasComplete && realStations.every((s) => visited.has(s.id))) {
      celebrate([
        {
          name: t('lineName', { number: line.number }),
          icon: '🎉',
          label: t('rail.lineCompleted'),
        },
      ]);
    }
    // Badges débloqués par l'un ou l'autre des cochages (à l'arrivée des réponses du serveur).
    void Promise.allSettled(sent).then((results) => {
      const badges = results.flatMap((r) => (r.status === 'fulfilled' ? r.value.newBadges : []));
      celebrate([...new Map(badges.map((b) => [b.id, b])).values()]);
    });

    setUndo(tripUndo(changes, before));
    undoTimer.current = setTimeout(() => setUndo(null), UNDO_MS);
  };

  /** Défait le dernier trajet validé : chaque station retrouve son état d'avant. */
  const undoLast = () => {
    if (!undo) return;
    void Promise.allSettled(send(undo));
    feedback('todo');
    forgetUndo();
  };

  return {
    /** Saisie en cours (les taps sur le rail choisissent le départ puis l'arrivée). */
    active,
    start,
    end,
    /** Nombre de stations du trajet choisi, départ et arrivée compris. */
    length: path?.length ?? 0,
    /** Stations à mettre en évidence sur le rail (le départ seul, puis tout le trajet). */
    highlighted,
    canUndo: undo !== null,
    begin,
    pick,
    confirm,
    cancel: reset,
    undoLast,
  };
}

export type Trip = ReturnType<typeof useTrip>;
