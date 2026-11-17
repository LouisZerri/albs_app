import { z } from 'zod';

import { apiFetch } from '@/shared/lib';

import {
  badgeStatusSchema,
  visitSchema,
  warningSchema,
  type BadgeStatus,
  type Visit,
  type Warning,
} from '../types';

/** Tous les badges avec leur statut (acquis + progression) pour l'utilisateur connecté. */
export async function fetchBadges(): Promise<BadgeStatus[]> {
  const data = await apiFetch<unknown>('/api/me/badges');
  return z.array(badgeStatusSchema).parse(data);
}

/** Stations où l'utilisateur est descendu, datées de la première visite, plus récentes d'abord. */
export async function fetchHistory(): Promise<Visit[]> {
  const data = await apiFetch<unknown>('/api/me/history');
  return z.array(visitSchema).parse(data);
}

/** Avertissements de modération du compte courant (plus récents d'abord). */
export async function fetchWarnings(): Promise<Warning[]> {
  const data = await apiFetch<unknown>('/api/me/warnings');
  return z.array(warningSchema).parse(data);
}

/** Marque un avertissement comme lu. */
export async function acknowledgeWarning(id: number): Promise<void> {
  await apiFetch(`/api/me/warnings/${id}/acknowledge`, { method: 'POST' });
}
