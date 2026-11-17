import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '@/features/auth/store';
import { useNetworkStats } from '@/features/network/hooks';
import { Button, ErrorState, Skeleton, SubScreen, Text, useToast } from '@/shared/ui';

import { useHistory, useShareImage } from '../hooks';
import { dayOf, formatDate } from '../lib/history';
import { ShareCard } from './ShareCard';

/** Partager ma progression : aperçu de la carte-souvenir + bouton de partage. */
export function ShareScreen() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const stats = useNetworkStats();
  const history = useHistory();
  const { ref, share, sharing } = useShareImage();

  // La date de début est un plus : si l'historique n'est pas chargé, la carte s'en passe.
  const first = history.data?.[history.data.length - 1];

  const onShare = () => {
    share().catch(() => toast.show("Impossible de partager l'image. Réessaie.", 'error'));
  };

  return (
    <SubScreen title="Partager ma progression" onBack={() => router.back()}>
      {stats.isPending ? (
        <Skeleton className="mt-3 h-96 w-full rounded-card" />
      ) : stats.isError ? (
        <ErrorState
          error={stats.error}
          message="Impossible de préparer ton image."
          onRetry={() => stats.refetch()}
        />
      ) : (
        <View className="gap-5 py-3">
          <ShareCard
            captureRef={ref}
            username={user?.username ?? ''}
            stats={stats.data}
            since={first ? formatDate(dayOf(first)) : undefined}
          />
          <Button label="Partager l’image" onPress={onShare} loading={sharing} />
          <Text variant="muted" className="text-center">
            Envoie-la à tes proches ou enregistre-la dans tes photos.
          </Text>
        </View>
      )}
    </SubScreen>
  );
}
