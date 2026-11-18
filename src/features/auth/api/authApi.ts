import { apiFetch } from '@/shared/lib';

import {
  authTokensSchema,
  userSchema,
  type AuthTokens,
  type LoginInput,
  type RegisterInput,
  type User,
} from '../types';

/** Connexion : renvoie le JWT + le refresh token. */
export async function login(input: LoginInput): Promise<AuthTokens> {
  const data = await apiFetch<unknown>('/api/login', { method: 'POST', body: input, auth: false });
  return authTokensSchema.parse(data);
}

/** Inscription : crée le compte et renvoie l'utilisateur. */
export async function register(input: RegisterInput): Promise<User> {
  const data = await apiFetch<unknown>('/api/register', {
    method: 'POST',
    body: input,
    auth: false,
  });
  return userSchema.parse(data);
}

/** Profil de l'utilisateur connecté (nécessite un JWT valide). */
export async function fetchMe(): Promise<User> {
  const data = await apiFetch<unknown>('/api/me');
  return userSchema.parse(data);
}

/** Demande un email de réinitialisation (réponse neutre, anti-énumération). */
export async function forgotPassword(email: string): Promise<void> {
  await apiFetch('/api/forgot-password', { method: 'POST', body: { email }, auth: false });
}

export type ResetPasswordInput = { email: string; code: string; password: string };

/** Réinitialise le mot de passe à partir du code reçu par email. */
export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await apiFetch('/api/reset-password', { method: 'POST', body: input, auth: false });
}

/** Confirme l'adresse email à partir du code reçu par email. */
export async function verifyEmail(input: { email: string; code: string }): Promise<void> {
  await apiFetch('/api/verify-email', { method: 'POST', body: input, auth: false });
}

/** Demande un nouveau code de confirmation, sans être connecté (réponse neutre). */
export async function requestVerificationCode(email: string): Promise<void> {
  await apiFetch('/api/resend-verification', { method: 'POST', body: { email }, auth: false });
}

/** Marque l'onboarding comme terminé (JWT requis). Renvoie l'utilisateur à jour. */
export async function completeOnboarding(): Promise<User> {
  const data = await apiFetch<unknown>('/api/me/complete-onboarding', { method: 'POST' });
  return userSchema.parse(data);
}

/** Échange un refresh token contre un nouveau couple de tokens. */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const data = await apiFetch<unknown>('/api/token/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    auth: false,
  });
  return authTokensSchema.parse(data);
}
