import { Linking, Platform } from 'react-native';

import type { LatLng } from './distance';

/** Ouvre l'itinéraire à pied vers le point dans l'app de cartes du téléphone (Plans / Google Maps). */
export function openWalkingDirections({ latitude, longitude }: LatLng): Promise<void> {
  const destination = `${latitude},${longitude}`;
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${destination}&dirflg=w`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;

  return Linking.openURL(url);
}
