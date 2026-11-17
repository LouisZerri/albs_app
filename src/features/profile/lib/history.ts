import { dateLocale, i18n, isPlural } from '@/i18n/instance';

import type { Visit } from '../types';

/**
 * Les dates viennent de l'API au fuseau de Paris (« 2026-11-17T11:01:10+01:00 ») : on lit le jour,
 * le mois et l'heure directement dans la chaîne, pour ne pas dépendre du fuseau du téléphone.
 */
const dayOf = (visit: Visit) => visit.visitedAt.slice(0, 10); // 2026-11-17
const monthOf = (visit: Visit) => visit.visitedAt.slice(0, 7); // 2026-11

/** Heure de la visite, « 11:01 ». */
export const timeOf = (visit: Visit) => visit.visitedAt.slice(11, 16);

/** Nom court du mois dans la langue active (« janv. », « Jan »). */
const monthLabel = (date: Date) => date.toLocaleDateString(dateLocale(), { month: 'short' });

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export type HistorySummary = {
  /** La toute première station visitée. */
  first: Visit;
  thisMonth: number;
  /** Le jour où le plus de stations ont été visitées. */
  bestDay: { day: string; count: number };
};

/** Chiffres clés de l'historique ; null s'il est vide. `visits` = plus récentes d'abord. */
export function summarize(visits: Visit[], now: Date): HistorySummary | null {
  if (visits.length === 0) return null;

  const perDay = new Map<string, number>();
  for (const visit of visits) perDay.set(dayOf(visit), (perDay.get(dayOf(visit)) ?? 0) + 1);
  const [day, count] = [...perDay.entries()].reduce((best, entry) =>
    entry[1] > best[1] ? entry : best,
  );

  return {
    first: visits[visits.length - 1],
    thisMonth: visits.filter((v) => monthOf(v) === monthKey(now)).length,
    bestDay: { day, count },
  };
}

export type MonthCount = { key: string; label: string; count: number };

/** Nombre de stations visitées sur chacun des `span` derniers mois (du plus ancien au mois courant). */
export function monthlyCounts(visits: Visit[], now: Date, span = 6): MonthCount[] {
  return Array.from({ length: span }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (span - 1 - i), 1);
    const key = monthKey(date);
    return {
      key,
      label: monthLabel(date),
      count: visits.filter((v) => monthOf(v) === key).length,
    };
  });
}

export type DayGroup = { day: string; visits: Visit[] };

/** Regroupe les visites par jour, en gardant l'ordre reçu (plus récentes d'abord). */
export function groupByDay(visits: Visit[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const visit of visits) {
    const last = groups[groups.length - 1];
    if (last?.day === dayOf(visit)) last.visits.push(visit);
    else groups.push({ day: dayOf(visit), visits: [visit] });
  }
  return groups;
}

/** « 2026-11-17 » → « mardi 17 novembre 2026 ». */
export function formatDay(day: string): string {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date).toLocaleDateString(dateLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** « 2026-07-07 » → « 7 juillet 2026 ». */
export function formatDate(day: string): string {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date).toLocaleDateString(dateLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Ancienneté d'un jour : « aujourd'hui », « il y a 3 jours », « il y a 4 mois », « il y a 2 ans ». */
export function timeAgo(day: string, now: Date): string {
  const [year, month, date] = day.split('-').map(Number);
  const days = Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(year, month - 1, date).getTime()) /
      86_400_000,
  );

  if (days <= 0) return i18n.t('profile:history.today');
  if (days === 1) return i18n.t('profile:history.yesterday');
  if (days < 31) return i18n.t('profile:history.daysAgo', { count: days });
  const months = Math.round(days / 30.44);
  if (months < 12) {
    const key = isPlural(months) ? 'profile:history.monthsAgoMany' : 'profile:history.monthsAgoOne';
    return i18n.t(key, { count: months });
  }
  const years = Math.floor(months / 12);
  return years > 1
    ? i18n.t('profile:history.yearsAgoMany', { count: years })
    : i18n.t('profile:history.yearsAgoOne');
}

export { dayOf };
