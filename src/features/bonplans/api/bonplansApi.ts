import { z } from 'zod';

import { apiFetch } from '@/shared/lib';

import {
  bonplanSchema,
  bonplanStationSchema,
  stationBonplansSchema,
  type Bonplan,
  type BonplanInput,
  type BonplanStation,
  type StationBonplans,
} from '../types';

/** Stations ayant au moins un bon plan approuvé (triées par nom). */
export async function fetchBonplanStations(): Promise<BonplanStation[]> {
  const data = await apiFetch<unknown>('/api/bonplans/stations');
  return z.array(bonplanStationSchema).parse(data);
}

/** Une station et ses bons plans approuvés (avec `isFavorite` pour l'utilisateur). */
export async function fetchStationBonplans(stationId: number): Promise<StationBonplans> {
  const data = await apiFetch<unknown>(`/api/stations/${stationId}/bonplans`);
  return stationBonplansSchema.parse(data);
}

/** Ajoute ou retire un bon plan des favoris de l'utilisateur. */
export async function setBonplanFavorite(bonplanId: number, favorite: boolean): Promise<void> {
  await apiFetch(`/api/bonplans/${bonplanId}/favorite`, { method: favorite ? 'POST' : 'DELETE' });
}

/** Les bons plans mis en favori par l'utilisateur (plus récents d'abord). */
export async function fetchFavorites(): Promise<Bonplan[]> {
  const data = await apiFetch<unknown>('/api/me/favorites');
  return z.array(bonplanSchema).parse(data);
}

/** Propose un bon plan pour une station. Il n'apparaîtra qu'après modération. */
export async function submitBonplan(stationId: number, input: BonplanInput): Promise<void> {
  await apiFetch(`/api/stations/${stationId}/bonplans`, { method: 'POST', body: input });
}
