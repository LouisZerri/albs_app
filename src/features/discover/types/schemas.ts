import { z } from 'zod';

import { correspondenceSchema } from '@/features/network/types';

/** Une étape d'un parcours : une station à visiter. */
export const journeyStopSchema = z.object({
  /** Quai représentatif de la station (sert à ouvrir ses bons plans). */
  stationId: z.number(),
  name: z.string(),
  /** Ce qu'il y a à voir (facultatif). */
  note: z.string().nullable(),
  lines: z.array(correspondenceSchema),
  visited: z.boolean(),
});
export type JourneyStop = z.infer<typeof journeyStopSchema>;

/** Un parcours thématique, avec l'avancement de l'utilisateur. */
export const journeySchema = z.object({
  key: z.string(),
  title: z.string(),
  icon: z.string(),
  pitch: z.string(),
  visited: z.number(),
  total: z.number(),
  stops: z.array(journeyStopSchema),
});
export type Journey = z.infer<typeof journeySchema>;

/** Une station fantôme : fermée ou jamais ouverte, débloquée en visitant celles qui l'encadrent. */
export const ghostStationSchema = z.object({
  key: z.string(),
  name: z.string(),
  /** Ligne(s) concernée(s), en clair (ex. « Lignes 8 et 9 »). */
  lines: z.string(),
  unlocked: z.boolean(),
  /** Son histoire ; null tant qu'elle n'est pas débloquée. */
  story: z.string().nullable(),
  /** Stations à visiter pour la débloquer, et celles qui manquent encore. */
  unlockedBy: z.array(z.string()),
  missing: z.array(z.string()),
});
export type GhostStation = z.infer<typeof ghostStationSchema>;
