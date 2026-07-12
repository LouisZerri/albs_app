import { z } from 'zod';

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
});
export type BadgeStatus = z.infer<typeof badgeStatusSchema>;
