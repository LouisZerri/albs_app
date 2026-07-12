import { z } from 'zod';

import { apiFetch } from '@/shared/lib';

import { badgeStatusSchema, warningSchema, type BadgeStatus, type Warning } from '../types';

/** Tous les badges avec leur statut (acquis + progression) pour l'utilisateur connecté. */
export async function fetchBadges(): Promise<BadgeStatus[]> {
  const data = await apiFetch<unknown>('/api/me/badges');
  return z.array(badgeStatusSchema).parse(data);
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
