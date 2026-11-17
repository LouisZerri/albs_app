import { z } from 'zod';

import { correspondenceSchema } from './lineSchemas';

/** Une ligne avec sa géométrie (segments de [lng, lat]) pour la carte. */
export const lineGeoSchema = z.object({
  id: z.number(),
  number: z.string(),
  color: z.string(),
  textColor: z.string().nullable(),
  geometry: z.array(z.array(z.tuple([z.number(), z.number()]))).nullable(),
});
export type LineGeo = z.infer<typeof lineGeoSchema>;

/** Une station géolocalisée (dédupliquée par nom) pour la carte. */
export const mapStationSchema = z.object({
  id: z.number(),
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  lines: z.array(correspondenceSchema).default([]),
  /** Bons plans autour de la station (lien vers l'onglet Bons plans). */
  bonplanCount: z.number().default(0),
  /** « Pourquoi descendre ici ? » ; null si la station n'a pas d'anecdote. */
  fact: z.string().nullable().default(null),
});
export type MapStation = z.infer<typeof mapStationSchema>;

export const networkGeoSchema = z.object({
  lines: z.array(lineGeoSchema),
  stations: z.array(mapStationSchema),
});
export type NetworkGeo = z.infer<typeof networkGeoSchema>;
