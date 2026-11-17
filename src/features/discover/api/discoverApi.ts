import { z } from 'zod';

import { apiFetch } from '@/shared/lib';

import { ghostStationSchema, journeySchema, type GhostStation, type Journey } from '../types';

/** Parcours thématiques, avec l'avancement de l'utilisateur sur chacun. */
export async function fetchJourneys(): Promise<Journey[]> {
  const data = await apiFetch<unknown>('/api/me/journeys');
  return z.array(journeySchema).parse(data);
}

/** Stations fantômes, débloquées ou non selon les stations visitées. */
export async function fetchGhostStations(): Promise<GhostStation[]> {
  const data = await apiFetch<unknown>('/api/me/ghost-stations');
  return z.array(ghostStationSchema).parse(data);
}
