import { setAudioModeAsync, useAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';

import type { StationState } from '../lib/stationState';

const PASSED = require('../../../../assets/sounds/passed.wav');
const VISITED = require('../../../../assets/sounds/visited.wav');
const RESET = require('../../../../assets/sounds/reset.wav');

// Rewind puis play (enchaînés) : évite que play parte avant le retour à 0 (silence sur taps rapides).
function playFromStart(player: AudioPlayer) {
  player
    .seekTo(0)
    .then(() => player.play())
    .catch(() => undefined);
}

/** Retour son + haptique au cochage d'une station, selon l'état obtenu (repris du web). */
export function useStationFeedback() {
  const passed = useAudioPlayer(PASSED);
  const visited = useAudioPlayer(VISITED);
  const reset = useAudioPlayer(RESET);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  return useCallback(
    (state: StationState) => {
      if (state === 'visited') {
        playFromStart(visited);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (state === 'passed') {
        playFromStart(passed);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        playFromStart(reset);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [passed, visited, reset],
  );
}
