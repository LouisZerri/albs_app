import { z } from 'zod';

import { i18n } from '@/i18n/instance';

import { isPasswordValid } from '../lib/passwordRules';

/**
 * Utilisateur tel que renvoyé par l'API (groupe `user:read`).
 * API Platform omet les champs `null` (ex. `avatarUrl`) → on les marque optionnels
 * pour ne pas casser la validation selon l'état du compte.
 */
export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  username: z.string(),
  accountStatus: z.string(),
  avatarUrl: z.string().nullable().optional(),
  isEmailVerified: z.boolean().optional(),
  onboardingCompletedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  displayedBadges: z.array(z.number()).optional(),
  favoriteLine: z
    .object({
      id: z.number(),
      number: z.string(),
      color: z.string(),
      textColor: z.string().nullable(),
    })
    .nullable()
    .optional(),
});
export type User = z.infer<typeof userSchema>;

/** Couple de tokens renvoyé par `/api/login` et `/api/token/refresh`. */
export const authTokensSchema = z.object({
  token: z.string(),
  refresh_token: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

/**
 * Les schémas de saisie sont des fabriques : leurs messages sont lus dans la langue active au
 * moment de l'appel. Dans un composant : `useMemo(() => createLoginSchema(), [language])`.
 */
export const createEmailSchema = () => z.email({ message: i18n.t('auth:validation.emailInvalid') });

/** Corps envoyé à `/api/login`. */
export const createLoginSchema = () =>
  z.object({
    email: createEmailSchema(),
    password: z.string().min(1, i18n.t('auth:validation.passwordRequired')),
  });
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;

/**
 * Corps envoyé à `/api/register` (aligné sur le groupe `user:create`).
 */
export const createRegisterSchema = () =>
  z.object({
    email: createEmailSchema(),
    username: z
      .string()
      .min(3, i18n.t('auth:validation.usernameMin'))
      .max(30, i18n.t('auth:validation.usernameMax')),
    plainPassword: z
      .string()
      .refine(isPasswordValid, { message: i18n.t('auth:validation.passwordAllRules') }),
    /** Acceptation des CGU : exigée par l'API, qui en horodate la trace (`terms_accepted_at`). */
    acceptedTerms: z.literal(true, { message: i18n.t('auth:validation.termsRequired') }),
  });
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
