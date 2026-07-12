import { z } from 'zod';

/** Une ligne avec la progression de l'utilisateur (issue de /api/me/stats). */
export const lineStatsSchema = z.object({
  id: z.number(),
  number: z.string(),
  name: z.string(),
  color: z.string(),
  textColor: z.string().nullable(),
  total: z.number(),
  visited: z.number(),
  passed: z.number(),
  percent: z.number(),
});
export type LineStats = z.infer<typeof lineStatsSchema>;

/** Statistiques réseau de l'utilisateur : global + par ligne. */
export const networkStatsSchema = z.object({
  stations: z.object({ total: z.number(), visited: z.number(), passed: z.number() }),
  percent: z.number(),
  lines: z.array(lineStatsSchema),
});
export type NetworkStats = z.infer<typeof networkStatsSchema>;
