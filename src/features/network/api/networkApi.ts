import { z } from 'zod';

import { apiFetch } from '@/shared/lib';

import {
  badgeSchema,
  lineDetailSchema,
  networkGeoSchema,
  networkStatsSchema,
  platformSchema,
  progressEntrySchema,
  type LineDetail,
  type NetworkGeo,
  type NetworkStats,
  type Platform,
  type ProgressEntry,
} from '../types';

const setProgressResponseSchema = z.object({
  progress: progressEntrySchema,
  newBadges: z.array(badgeSchema),
});
export type SetProgressResponse = z.infer<typeof setProgressResponseSchema>;

/** Statistiques réseau de l'utilisateur connecté (global + par ligne). */
export async function fetchNetworkStats(): Promise<NetworkStats> {
  const data = await apiFetch<unknown>('/api/me/stats');
  return networkStatsSchema.parse(data);
}

/** Détail d'une ligne : stations ordonnées + correspondances. */
export async function fetchLineDetail(id: number): Promise<LineDetail> {
  const data = await apiFetch<unknown>(`/api/lines/${id}`);
  return lineDetailSchema.parse(data);
}

/** Tout le réseau (géométrie des lignes + stations géolocalisées) pour la carte. */
export async function fetchNetwork(): Promise<NetworkGeo> {
  const data = await apiFetch<unknown>('/api/network');
  return networkGeoSchema.parse(data);
}

/** Index de tous les quais du réseau (id, nom, ligne). */
export async function fetchPlatforms(): Promise<Platform[]> {
  const data = await apiFetch<unknown>('/api/network/platforms');
  return z.array(platformSchema).parse(data);
}

/** Toute la progression de l'utilisateur (une entrée par station touchée). */
export async function fetchMyProgress(): Promise<ProgressEntry[]> {
  const data = await apiFetch<unknown>('/api/me/progress');
  return z.array(progressEntrySchema).parse(data);
}

/** Définit l'état d'une station. Renvoie l'entrée à jour + les badges débloqués. */
export async function setStationProgress(
  stationId: number,
  /** `at` : moment réel du cochage (ISO), quand il est envoyé après coup. */
  body: { passed: boolean; stopped: boolean; at?: string },
): Promise<SetProgressResponse> {
  const data = await apiFetch<unknown>(`/api/stations/${stationId}/progress`, {
    method: 'PUT',
    body,
  });
  return setProgressResponseSchema.parse(data);
}
