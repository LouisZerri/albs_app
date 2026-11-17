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
  /**
   * Lignes de la station. Pour un pôle, chacune porte la position de la station SUR cette ligne
   * (`lat`/`lng`), utilisée quand la ligne est mise en avant sur la carte.
   */
  lines: z
    .array(correspondenceSchema.extend({ lat: z.number().optional(), lng: z.number().optional() }))
    .default([]),
  /** Bons plans autour de la station (lien vers l'onglet Bons plans). */
  bonplanCount: z.number().default(0),
  /** « Pourquoi descendre ici ? » ; null si la station n'a pas d'anecdote. */
  fact: z.string().nullable().default(null),
});
export type MapStation = z.infer<typeof mapStationSchema>;

/** Un quai : une station sur une ligne. Plusieurs quais de même nom = une station physique. */
export const platformSchema = z.object({
  id: z.number(),
  name: z.string(),
  lineId: z.number(),
});
export type Platform = z.infer<typeof platformSchema>;

export const networkGeoSchema = z.object({
  lines: z.array(lineGeoSchema),
  stations: z.array(mapStationSchema),
});
export type NetworkGeo = z.infer<typeof networkGeoSchema>;
