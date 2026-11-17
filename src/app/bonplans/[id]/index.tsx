import { useLocalSearchParams } from 'expo-router';

import { StationBonplansScreen } from '@/features/bonplans/components';

export default function StationBonplansRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StationBonplansScreen id={Number(id)} />;
}
