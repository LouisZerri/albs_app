import { apiFetch } from '@/shared/lib';

import { userSchema, type User } from '../types';

export type UpdateProfileInput = {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  favoriteLineId?: number | null;
};

/** Met à jour le profil (pseudo / email / mot de passe). Renvoie l'utilisateur à jour. */
export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const data = await apiFetch<unknown>('/api/me', { method: 'PATCH', body: input });
  return userSchema.parse(data);
}

/** Fichier image sélectionné (expo-image-picker) prêt pour un envoi multipart. */
export type AvatarFile = { uri: string; name: string; type: string };

/** Envoie/remplace l'avatar (multipart). Renvoie l'utilisateur à jour. */
export async function uploadAvatar(file: AvatarFile): Promise<User> {
  const form = new FormData();
  // En React Native, un fichier est décrit par { uri, name, type }.
  form.append('avatar', file as unknown as Blob);
  const data = await apiFetch<unknown>('/api/me/avatar', { method: 'POST', body: form });
  return userSchema.parse(data);
}

/** Supprime l'avatar (retour aux initiales). Renvoie l'utilisateur à jour. */
export async function deleteAvatar(): Promise<User> {
  const data = await apiFetch<unknown>('/api/me/avatar', { method: 'DELETE' });
  return userSchema.parse(data);
}

/** Suppression (anonymisation RGPD) du compte courant. */
export async function deleteAccount(): Promise<void> {
  await apiFetch('/api/me', { method: 'DELETE' });
}

/** Renvoie un nouveau code de vérification à l'adresse du compte courant. */
export async function resendVerification(): Promise<void> {
  await apiFetch('/api/me/resend-verification', { method: 'POST' });
}

/** Ajoute/retire un badge de la vitrine (max 3). Renvoie l'utilisateur à jour. */
export async function toggleDisplayBadge(badgeId: number): Promise<User> {
  const data = await apiFetch<unknown>(`/api/me/badges/${badgeId}/display`, { method: 'PUT' });
  return userSchema.parse(data);
}
