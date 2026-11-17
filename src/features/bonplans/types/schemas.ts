import { z } from 'zod';

import { i18n } from '@/i18n/instance';
import { correspondenceSchema } from '@/features/network/types';

/**
 * Une station physique ayant au moins un bon plan (accueil de l'onglet Bons plans).
 * Les quais de même nom sont regroupés : `lines` = toutes les lignes qui la desservent.
 */
export const bonplanStationSchema = z.object({
  /** Un quai représentatif de la station (sert à ouvrir son écran). */
  id: z.number(),
  name: z.string(),
  /** Nombre de bons plans approuvés autour de la station (sans doublon entre quais). */
  count: z.number(),
  lines: z.array(correspondenceSchema),
});
export type BonplanStation = z.infer<typeof bonplanStationSchema>;

/** Un bon plan (spot) autour d'une station. */
export const bonplanSchema = z.object({
  id: z.number(),
  /** Quai auquel le bon plan est rattaché (sert à ouvrir l'écran de sa station). */
  stationId: z.number(),
  stationName: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  categoryIcon: z.string(),
  address: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  /** `osm` (OpenStreetMap) ou `community` (proposé par un membre). */
  source: z.string(),
  author: z.string().nullable(),
  isFavorite: z.boolean(),
});
export type Bonplan = z.infer<typeof bonplanSchema>;

/** Écran d'une station : la station (carte + en-tête) et ses bons plans. */
export const stationBonplansSchema = z.object({
  station: z.object({
    id: z.number(),
    name: z.string(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    lines: z.array(correspondenceSchema),
    /** « Pourquoi descendre ici ? » ; null si la station n'a pas d'anecdote. */
    fact: z.string().nullable().default(null),
  }),
  bonplans: z.array(bonplanSchema),
});
export type StationBonplans = z.infer<typeof stationBonplansSchema>;

export const BONPLAN_CATEGORY_KEYS = [
  'restaurant',
  'bar',
  'cafe',
  'monument',
  'shop',
  'culture',
  'park',
  'other',
] as const;

/**
 * Saisie du formulaire « Proposer un bon plan » (limites = celles de l'API).
 * Fabrique : les messages sont lus dans la langue active au moment de l'appel.
 */
export const createBonplanInputSchema = () =>
  z.object({
    title: z
      .string()
      .trim()
      .min(3, i18n.t('bonplans:form.errors.titleMin'))
      .max(150, i18n.t('bonplans:form.errors.titleMax')),
    category: z.enum(BONPLAN_CATEGORY_KEYS, { message: i18n.t('bonplans:form.errors.category') }),
    address: z.string().trim().max(255, i18n.t('bonplans:form.errors.addressMax')),
    description: z.string().trim().max(1000, i18n.t('bonplans:form.errors.descriptionMax')),
    /** Position choisie sur la carte (facultative) : donne un point sur la carte et « Y aller ». */
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  });
export type BonplanInput = z.infer<ReturnType<typeof createBonplanInputSchema>>;
