import { useLocalSearchParams } from 'expo-router';

import { LineRailScreen } from '@/features/network/components';

export default function LineScreen() {
  // `station` (facultatif) : nom d'une station à atteindre, quand on vient de la recherche.
  const { id, station } = useLocalSearchParams<{ id: string; station?: string }>();
  return <LineRailScreen id={Number(id)} focusStation={station} />;
}
