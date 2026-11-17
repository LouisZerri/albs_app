import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { LineBadges } from '@/features/network/components';
import { isPlural, useTranslation } from '@/i18n';
import { Card, ErrorState, Skeleton, SkeletonList, SubScreen, Text } from '@/shared/ui';

import { useHistory } from '../hooks';
import {
  dayOf,
  formatDay,
  groupByDay,
  monthlyCounts,
  summarize,
  timeAgo,
  timeOf,
} from '../lib/history';
import { MonthlyBars } from './MonthlyBars';

/** Mon historique : chiffres clés, activité des derniers mois et frise des stations visitées. */
export function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const { data, error, isPending, isError, refetch } = useHistory();
  const now = new Date();
  const summary = data ? summarize(data, now) : null;

  return (
    <SubScreen title={t('history.title')} onBack={() => router.back()}>
      {isPending ? (
        <View className="gap-4 py-3">
          <Skeleton className="h-24 w-full rounded-card" />
          <SkeletonList count={4} className="px-0" />
        </View>
      ) : isError ? (
        <ErrorState error={error} message={t('history.loadError')} onRetry={() => refetch()} />
      ) : !summary ? (
        <View className="flex-1 items-center justify-center gap-1.5 px-6">
          <Text variant="subtitle" className="text-center">
            {t('history.emptyTitle')}
          </Text>
          <Text variant="muted" className="text-center">
            {t('history.emptyHint')}
          </Text>
        </View>
      ) : (
        <View className="gap-5 py-3">
          <View className="flex-row gap-3">
            <Card className="flex-1 gap-1 p-3">
              <Text variant="label">{t('history.thisMonth')}</Text>
              <Text variant="title" color="accent">
                {summary.thisMonth}
              </Text>
              <Text variant="muted">
                {isPlural(summary.thisMonth) ? t('history.stationMany') : t('history.stationOne')}
              </Text>
            </Card>
            <Card className="flex-1 gap-1 p-3">
              <Text variant="label">{t('history.bestDay')}</Text>
              <Text variant="title" color="accent">
                {summary.bestDay.count}
              </Text>
              <Text variant="muted">{timeAgo(summary.bestDay.day, now)}</Text>
            </Card>
          </View>

          <Card className="gap-1">
            <Text variant="label">{t('history.firstStation')}</Text>
            <Text variant="subtitle">{summary.first.name}</Text>
            <Text variant="muted">
              {formatDay(dayOf(summary.first))} · {timeAgo(dayOf(summary.first), now)}
            </Text>
          </Card>

          <Card className="gap-3">
            <Text variant="label">{t('history.lastMonths')}</Text>
            <MonthlyBars months={monthlyCounts(data, now)} />
          </Card>

          {groupByDay(data).map((group) => (
            <View key={group.day} className="gap-2">
              <Text variant="label">{formatDay(group.day)}</Text>
              <Card className="gap-3">
                {group.visits.map((visit) => (
                  <View key={visit.name} className="flex-row items-center gap-3">
                    <Text variant="muted" className="w-11">
                      {timeOf(visit)}
                    </Text>
                    <Text className="flex-1" numberOfLines={1}>
                      {visit.name}
                    </Text>
                    <LineBadges lines={visit.lines} />
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>
      )}
    </SubScreen>
  );
}
