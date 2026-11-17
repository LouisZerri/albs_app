import { z } from 'zod';

import { correspondenceSchema } from '@/features/network/types';

/** Un avertissement de modération (issu de /api/me/warnings). */
export const warningSchema = z.object({
  id: z.number(),
  reason: z.string(),
  createdAt: z.string().nullable(),
  acknowledgedAt: z.string().nullable(),
});
export type Warning = z.infer<typeof warningSchema>;

/** Un badge avec son statut pour l'utilisateur (issu de /api/me/badges). */
export const badgeStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  type: z.string(),
  earned: z.boolean(),
  progress: z.number(), // % vers le déblocage (100 si acquis)
  /** Compteur vers le déblocage (ex. 12 sur 20) ; null si acquis ou badge sans compteur. */
  current: z.number().nullable().default(null),
  target: z.number().nullable().default(null),
});
export type BadgeStatus = z.infer<typeof badgeStatusSchema>;

/** Une station visitée, datée de la première descente (issue de /api/me/history). */
export const visitSchema = z.object({
  name: z.string(),
  /** Date ISO avec le fuseau de Paris (ex. 2026-11-17T11:01:10+01:00). */
  visitedAt: z.string(),
  lines: z.array(correspondenceSchema),
});
export type Visit = z.infer<typeof visitSchema>;
