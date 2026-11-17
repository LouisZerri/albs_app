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

/** Un défi en cours (semaine, mois, ligne presque finie), calculé par l'API. */
export const challengeSchema = z.object({
  key: z.string(),
  title: z.string(),
  current: z.number(),
  target: z.number(),
  /** Ligne visée par le défi, s'il y en a une. */
  lineId: z.number().nullable(),
});
export type Challenge = z.infer<typeof challengeSchema>;

/** Statistiques réseau de l'utilisateur : global + par ligne. */
export const networkStatsSchema = z.object({
  stations: z.object({ total: z.number(), visited: z.number(), passed: z.number() }),
  percent: z.number(),
  /** Dernière ligne non terminée où l'utilisateur a coché une station (raccourci « Continuer »). */
  resumeLineId: z.number().nullable().default(null),
  challenges: z.array(challengeSchema).default([]),
  lines: z.array(lineStatsSchema),
});
export type NetworkStats = z.infer<typeof networkStatsSchema>;
