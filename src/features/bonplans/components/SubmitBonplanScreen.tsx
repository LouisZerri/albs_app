import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ApiError } from '@/shared/lib';
import { SubScreen, Text, useToast } from '@/shared/ui';

import { useStationBonplans, useSubmitBonplan } from '../hooks';
import type { BonplanInput } from '../types';
import { BonplanForm } from './BonplanForm';

/** Proposer un bon plan pour une station. Soumis à modération avant d'apparaître. */
export function SubmitBonplanScreen({ stationId }: { stationId: number }) {
  const router = useRouter();
  const toast = useToast();
  // Même requête que l'écran de la station → déjà en cache, sert juste à afficher son nom.
  const station = useStationBonplans(stationId).data?.station;
  const stationPoint =
    station && station.lat !== null && station.lng !== null
      ? { latitude: station.lat, longitude: station.lng }
      : null;
  const { mutate, isPending, error } = useSubmitBonplan(stationId);

  const submit = (input: BonplanInput) =>
    mutate(input, {
      onSuccess: () => {
        toast.show('Merci ! Ton bon plan sera visible après validation.', 'success');
        router.back();
      },
    });

  const apiError = error
    ? error instanceof ApiError
      ? error.message
      : 'Envoi impossible. Réessaie.'
    : null;

  return (
    <SubScreen
      title="Proposer un bon plan"
      subtitle={station ? `Près de ${station.name}` : undefined}
      onBack={() => router.back()}
    >
      <View className="gap-5 py-5">
        <Text variant="muted">
          Partage une bonne adresse à deux pas de la station. Elle sera vérifiée par l’équipe avant
          d’être publiée.
        </Text>
        <BonplanForm
          onSubmit={submit}
          loading={isPending}
          stationPoint={stationPoint}
          apiError={apiError}
        />
      </View>
    </SubScreen>
  );
}
