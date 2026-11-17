import { useLocalSearchParams } from 'expo-router';

import { JourneyScreen } from '@/features/discover/components';

export default function JourneyRoute() {
  const { key } = useLocalSearchParams<{ key: string }>();
  return <JourneyScreen journeyKey={key} />;
}
