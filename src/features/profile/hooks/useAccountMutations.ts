import { useMutation } from '@tanstack/react-query';

import {
  deleteAvatar,
  toggleDisplayBadge,
  updateProfile,
  uploadAvatar,
  type AvatarFile,
  type UpdateProfileInput,
} from '@/features/auth/api';
import { ME_QUERY_KEY } from '@/features/auth/store';
import type { User } from '@/features/auth/types';
import { queryClient } from '@/shared/lib';

/** Applique l'utilisateur renvoyé par l'API au cache de session (met à jour le profil affiché). */
function syncMe(user: User) {
  queryClient.setQueryData(ME_QUERY_KEY, user);
}

/** Édition du profil (pseudo / email / mot de passe). */
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: syncMe,
  });
}

/** Envoi/remplacement de l'avatar. */
export function useUploadAvatar() {
  return useMutation({
    mutationFn: (file: AvatarFile) => uploadAvatar(file),
    onSuccess: syncMe,
  });
}

/** Suppression de l'avatar. */
export function useDeleteAvatar() {
  return useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: syncMe,
  });
}

/** Ajoute/retire un badge de la vitrine du profil (max 3). */
export function useToggleDisplayBadge() {
  return useMutation({
    mutationFn: (badgeId: number) => toggleDisplayBadge(badgeId),
    onSuccess: syncMe,
  });
}
