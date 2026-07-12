import { z } from 'zod';

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

/** Corps envoyé à `/api/login`. */
export const loginInputSchema = z.object({
  email: z.email({ message: 'Email invalide.' }),
  password: z.string().min(1, 'Mot de passe requis.'),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

/**
 * Corps envoyé à `/api/register` (aligné sur le groupe `user:create`).
 * La case CGU se gère au niveau du formulaire, pas dans ce payload.
 */
export const registerInputSchema = z.object({
  email: z.email({ message: 'Email invalide.' }),
  username: z
    .string()
    .min(3, 'Le pseudo doit faire au moins 3 caractères.')
    .max(30, 'Le pseudo ne peut pas dépasser 30 caractères.'),
  plainPassword: z
    .string()
    .refine(isPasswordValid, { message: 'Le mot de passe ne respecte pas toutes les règles.' }),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;
