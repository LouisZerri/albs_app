import { useLocalSearchParams } from 'expo-router';

import { SubmitBonplanScreen } from '@/features/bonplans/components';

export default function SubmitBonplanRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SubmitBonplanScreen stationId={Number(id)} />;
}
