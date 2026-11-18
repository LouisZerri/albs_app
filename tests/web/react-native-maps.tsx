/**
 * Remplaçant de `react-native-maps` pour faire tourner l'app dans un NAVIGATEUR (essais sur
 * ordinateur, `npm run web:test`). La vraie carte n'existe pas sur le web : on affiche un cadre
 * avec le nombre de repères et de tracés, ce qui suffit pour essayer tout le reste de l'app.
 * N'est jamais utilisé sur téléphone.
 */
import { Children, forwardRef, useImperativeHandle, type ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';

type MapProps = ViewProps & { children?: ReactNode };

const MapView = forwardRef<unknown, MapProps>(function MapView({ children, style }, ref) {
  // Les méthodes appelées par l'app (recentrage) existent mais ne font rien.
  useImperativeHandle(ref, () => ({ animateToRegion: () => undefined, fitToCoordinates: () => undefined }));

  return (
    <View style={[{ backgroundColor: '#DDE3EA', alignItems: 'center', justifyContent: 'center' }, style]}>
      <Text testID="map-placeholder">Carte (non disponible dans un navigateur)</Text>
      <View style={{ display: 'none' }}>{Children.toArray(children)}</View>
    </View>
  );
});

const Nothing = () => null;

export default MapView;
export const Marker = Nothing;
export const Polyline = Nothing;
export const Polygon = Nothing;
export const Circle = Nothing;
export const Callout = Nothing;
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = undefined;
