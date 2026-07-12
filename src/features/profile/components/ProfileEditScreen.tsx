import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import type { UpdateProfileInput } from '@/features/auth/api';
import { useAuth } from '@/features/auth/store';
import { useNetworkStats } from '@/features/network/hooks';
import { colors } from '@/shared/theme';
import { Button, Input, Screen, Text, useToast } from '@/shared/ui';

import { useUpdateProfile } from '../hooks';
import { AvatarEditor } from './AvatarEditor';
import { DangerZone } from './DangerZone';
import { FavoriteLinePicker } from './FavoriteLinePicker';

type Field = 'username' | 'email' | 'currentPassword' | 'newPassword' | 'confirm' | 'general';
type Errors = Partial<Record<Field, string>>;

/** Associe un message d'erreur serveur au champ concerné (sinon « general »). */
function fieldForMessage(message: string): Field {
  if (/pseudo/i.test(message)) return 'username';
  if (/mail/i.test(message)) return 'email';
  if (/actuel/i.test(message)) return 'currentPassword';
  if (/mot de passe/i.test(message)) return 'newPassword';
  return 'general';
}

/** Écran d'édition du profil : avatar + identité + mot de passe + suppression de compte. */
export function ProfileEditScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const update = useUpdateProfile();
  const stats = useNetworkStats();
  const toast = useToast();

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [favoriteLineId, setFavoriteLineId] = useState<number | null>(user?.favoriteLine?.id ?? null);
  const [errors, setErrors] = useState<Errors>({});

  const save = () => {
    const errs: Errors = {};
    const payload: UpdateProfileInput = {};

    const name = username.trim();
    if (name !== user?.username) {
      if (name.length < 3 || name.length > 30) {
        errs.username = 'Le pseudo doit faire entre 3 et 30 caractères.';
      } else {
        payload.username = name;
      }
    }

    const mail = email.trim();
    if (mail !== user?.email) {
      if (!/^\S+@\S+\.\S+$/.test(mail)) {
        errs.email = 'Email invalide.';
      } else {
        payload.email = mail;
      }
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        errs.newPassword = 'Le nouveau mot de passe doit faire au moins 8 caractères.';
      }
      if (newPassword !== confirm) {
        errs.confirm = 'Les mots de passe ne correspondent pas.';
      }
      if (!currentPassword) {
        errs.currentPassword = 'Renseigne ton mot de passe actuel.';
      }
      if (!errs.newPassword && !errs.confirm && !errs.currentPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
    }

    if (favoriteLineId !== (user?.favoriteLine?.id ?? null)) {
      payload.favoriteLineId = favoriteLineId;
    }

    if (Object.keys(errs).length > 0) {
      return setErrors(errs);
    }
    setErrors({});

    if (Object.keys(payload).length === 0) {
      return toast.show('Aucune modification.', 'info');
    }

    update.mutate(payload, {
      onSuccess: () => {
        toast.show('Profil mis à jour ✅', 'success');
        router.back();
      },
      onError: (e) => setErrors({ [fieldForMessage(e.message)]: e.message }),
    });
  };

  return (
    <Screen scroll>
      <View className="flex-row items-center gap-3 py-2">
        <Pressable onPress={() => router.back()} className="p-1 active:opacity-60">
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="subtitle">Modifier le profil</Text>
      </View>

      <View className="gap-5 py-3 pb-10">
        <AvatarEditor username={user?.username ?? ''} avatarUrl={user?.avatarUrl} />

        <View className="gap-3">
          <Input
            label="Pseudo"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={errors.username}
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />
        </View>

        {stats.data ? (
          <FavoriteLinePicker
            lines={stats.data.lines}
            selectedId={favoriteLineId}
            onSelect={setFavoriteLineId}
          />
        ) : null}

        <View className="gap-3">
          <Text variant="label">Changer le mot de passe (optionnel)</Text>
          <Input
            label="Mot de passe actuel"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            error={errors.currentPassword}
          />
          <Input
            label="Nouveau mot de passe"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            error={errors.newPassword}
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            error={errors.confirm}
          />
        </View>

        {errors.general ? (
          <Text color="danger" className="text-sm">
            {errors.general}
          </Text>
        ) : null}

        <Button label="Enregistrer" loading={update.isPending} onPress={save} />

        <DangerZone />
      </View>
    </Screen>
  );
}
