import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { SubScreen, Text, useToast } from '@/shared/ui';

import { useStationBonplans, useSubmitBonplan } from '../hooks';
import type { BonplanInput } from '../types';
import { BonplanForm } from './BonplanForm';

/** Proposer un bon plan pour une station. Soumis à modération avant d'apparaître. */
export function SubmitBonplanScreen({ stationId }: { stationId: number }) {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation('bonplans');
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
        toast.show(t('submit.success'), 'success');
        router.back();
      },
    });

  const apiError = error
    ? error instanceof ApiError
      ? error.message
      : t('submit.sendError')
    : null;

  return (
    <SubScreen
      title={t('submit.title')}
      subtitle={station ? t('submit.nearStation', { name: station.name }) : undefined}
      onBack={() => router.back()}
    >
      <View className="gap-5 py-5">
        <Text variant="muted">{t('submit.intro')}</Text>
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
