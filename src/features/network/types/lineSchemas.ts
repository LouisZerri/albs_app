import { z } from 'zod';

/** Une correspondance = une autre ligne desservant la station. */
export const correspondenceSchema = z.object({
  lineId: z.number(),
  number: z.string(),
  color: z.string(),
  textColor: z.string().nullable(),
});
export type Correspondence = z.infer<typeof correspondenceSchema>;

export const stationSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.number(),
  branch: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  correspondences: z.array(correspondenceSchema),
  /** Bons plans autour de la station (lien vers l'onglet Bons plans). */
  bonplanCount: z.number().default(0),
  directionLabel: z.string().nullable(),
});
export type Station = z.infer<typeof stationSchema>;

/** Détail complet d'une ligne (stations ordonnées + correspondances). */
export const lineDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  name: z.string(),
  color: z.string(),
  textColor: z.string().nullable(),
  geometry: z.unknown().nullable(), // pour la carte plus tard
  loop: z.object({ label: z.string() }).nullable(),
  stations: z.array(stationSchema),
});
export type LineDetail = z.infer<typeof lineDetailSchema>;

/** Une entrée de progression (état d'une station pour l'utilisateur). */
export const progressEntrySchema = z.object({
  stationId: z.number(),
  passed: z.boolean(),
  stopped: z.boolean(),
  updatedAt: z.string().nullable().optional(),
  firstPassedAt: z.string().nullable().optional(),
  firstStoppedAt: z.string().nullable().optional(),
});
export type ProgressEntry = z.infer<typeof progressEntrySchema>;

/** Badge renvoyé lors d'un cochage (pour la célébration). */
export const badgeSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
});
export type Badge = z.infer<typeof badgeSchema>;
