import { useLocalSearchParams } from 'expo-router';

import { LineRailScreen } from '@/features/network/components';

export default function LineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LineRailScreen id={Number(id)} />;
}
