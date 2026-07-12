import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/shared/ui';

import { MapScreen } from './MapScreen';
import { NetworkList } from './NetworkList';
import { ReseauToggle, type ReseauMode } from './ReseauToggle';

/** Onglet Réseau : bascule Liste | Carte + la vue active. */
export function ReseauScreen() {
  const [mode, setMode] = useState<ReseauMode>('list');

  return (
    <Screen padded={false}>
      <View className="items-center px-5 pb-2 pt-1">
        <ReseauToggle mode={mode} onChange={setMode} />
      </View>

      <View className="flex-1">{mode === 'list' ? <NetworkList /> : <MapScreen />}</View>
    </Screen>
  );
}
