import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { LineBadges } from '@/features/network/components';
import { useThemeColors } from '@/shared/theme';
import { Card, ErrorState, ProgressBar, SkeletonList, SubScreen, Text } from '@/shared/ui';

import { useJourneys } from '../hooks';

/** Détail d'un parcours : ses étapes, celles déjà visitées, et un accès aux bons plans de chacune. */
export function JourneyScreen({ journeyKey }: { journeyKey: string }) {
  const router = useRouter();
  const colors = useThemeColors();
  const { data, error, isPending, isError, refetch } = useJourneys();
  const journey = data?.find((j) => j.key === journeyKey);

  return (
    <SubScreen
      title={journey ? `${journey.icon} ${journey.title}` : 'Parcours'}
      subtitle={journey ? `${journey.visited}/${journey.total} stations visitées` : undefined}
      onBack={() => router.back()}
    >
      {isPending ? (
        <SkeletonList className="px-0 pt-3" />
      ) : isError || !journey ? (
        <ErrorState
          error={error}
          message="Impossible de charger ce parcours."
          onRetry={() => refetch()}
        />
      ) : (
        <View className="gap-4 py-3">
          <Text variant="muted">{journey.pitch}</Text>
          <ProgressBar
            percent={journey.total > 0 ? (journey.visited / journey.total) * 100 : 0}
            color={journey.visited >= journey.total ? colors.visited : undefined}
          />

          <Card className="gap-1 px-3 py-1">
            {journey.stops.map((stop) => (
              <Pressable
                key={stop.name}
                onPress={() => router.push(`/bonplans/${stop.stationId}`)}
                accessibilityRole="button"
                accessibilityLabel={`${stop.name}${stop.visited ? ', visitée' : ', à visiter'}`}
                // Chaque étape mène aux bons plans de la station.
                className="min-h-[52px] flex-row items-center gap-3 py-2 active:opacity-60"
              >
                <Ionicons
                  name={stop.visited ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={stop.visited ? colors.visited : colors.muted}
                />
                <View className="flex-1">
                  <Text numberOfLines={1}>{stop.name}</Text>
                  {stop.note ? (
                    <Text variant="muted" numberOfLines={1}>
                      {stop.note}
                    </Text>
                  ) : null}
                </View>
                <LineBadges lines={stop.lines} />
              </Pressable>
            ))}
          </Card>

          <Text variant="muted" className="text-center">
            Coche les stations depuis le Réseau : le parcours se met à jour tout seul.
          </Text>
        </View>
      )}
    </SubScreen>
  );
}
