import { View } from 'react-native';

import { isPlural, useTranslation } from '@/i18n';
import { Text } from '@/shared/ui';

import type { MonthCount } from '../lib/history';

const MAX_BAR = 72;

/** Petit histogramme : une barre par mois, hauteur proportionnelle au mois le plus actif. UI pure. */
export function MonthlyBars({ months }: { months: MonthCount[] }) {
  const { t } = useTranslation('profile');
  const max = Math.max(1, ...months.map((m) => m.count));

  return (
    <View className="flex-row items-end gap-2">
      {months.map((month) => (
        <View
          key={month.key}
          className="flex-1 items-center gap-1"
          accessibilityLabel={t(
            isPlural(month.count) ? 'history.monthA11yMany' : 'history.monthA11yOne',
            {
              month: month.label,
              count: month.count,
            },
          )}
        >
          <Text variant="muted" style={{ fontSize: 12 }}>
            {month.count}
          </Text>
          <View
            // Mois vide : un trait fin, pour que l'axe reste lisible.
            className={
              month.count > 0 ? 'w-full rounded-md bg-accent' : 'w-full rounded-md bg-hair'
            }
            style={{ height: month.count > 0 ? Math.max(6, (month.count / max) * MAX_BAR) : 3 }}
          />
          <Text variant="muted" style={{ fontSize: 12 }}>
            {month.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
