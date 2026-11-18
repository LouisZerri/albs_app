import { useQueryClient } from '@tanstack/react-query';

import { useBadgeCelebration } from '@/features/badges';
import { useTranslation } from '@/i18n';

import { completesLine } from '../lib/railModel';
import { nextState, STATE_FLAGS, stationState } from '../lib/stationState';
import type { ProgressEntry, Station } from '../types';
import { PROGRESS_KEY } from './useMyProgress';
import { useStationFeedback } from './useStationFeedback';
import { useToggleStation } from './useToggleStation';

/**
 * Le tap sur une station du rail : passe à l'état suivant (à faire → passé → descendu → à faire),
 * avec son retour sonore, et fête les badges débloqués ou la ligne terminée.
 *
 * @param realStations les stations qui comptent pour terminer la ligne (toutes branches)
 */
export function useRailToggle(lineNumber: string | undefined, realStations: Station[]) {
  const queryClient = useQueryClient();
  const toggle = useToggleStation();
  const feedback = useStationFeedback();
  const { celebrate } = useBadgeCelebration();
  const { t } = useTranslation('network');

  return (station: Station) => {
    // Lecture du cache le plus frais (et pas d'une copie mémoïsée) → cycle fiable en rafale.
    const entries = queryClient.getQueryData<ProgressEntry[]>(PROGRESS_KEY) ?? [];
    const next = nextState(stationState(entries.find((e) => e.stationId === station.id)));

    feedback(next); // son + haptique immédiats

    // Dernière station de la ligne : on fête la ligne terminée, sans attendre le serveur.
    if (next === 'visited' && completesLine(realStations, entries, station.id)) {
      celebrate([
        { name: t('lineName', { number: lineNumber }), icon: '🎉', label: t('rail.lineCompleted') },
      ]);
    }

    toggle.mutate(
      { stationId: station.id, ...STATE_FLAGS[next] },
      { onSuccess: (res) => celebrate(res.newBadges) },
    );
  };
}
