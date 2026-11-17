import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import type { UpdateProfileInput } from '@/features/auth/api';
import { useAuth } from '@/features/auth/store';
import { useNetworkStats } from '@/features/network/hooks';
import { RemindersCard } from '@/features/reminders/components';
import { useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { useThemeColors } from '@/shared/theme';
import { Button, Card, Input, SubScreen, Text, useToast } from '@/shared/ui';

import { useUpdateProfile } from '../hooks';
import { AvatarEditor } from './AvatarEditor';
import { DangerZone } from './DangerZone';
import { FavoriteLinePicker } from './FavoriteLinePicker';

type Field = 'username' | 'email' | 'general';
type Errors = Partial<Record<Field, string>>;

/** Champ sous lequel afficher un refus du serveur : celui que l'API désigne, sinon « general ». */
function fieldOf(error: Error): Field {
  const field = error instanceof ApiError ? error.field : undefined;
  return field === 'username' || field === 'email' ? field : 'general';
}

/** Écran d'édition du profil : avatar, identité, ligne favorite ; accès au mot de passe et à la suppression. */
export function ProfileEditScreen() {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const router = useRouter();
  const { user } = useAuth();
  const update = useUpdateProfile();
  const stats = useNetworkStats();
  const toast = useToast();

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [favoriteLineId, setFavoriteLineId] = useState<number | null>(
    user?.favoriteLine?.id ?? null,
  );
  const [errors, setErrors] = useState<Errors>({});

  const save = () => {
    const errs: Errors = {};
    const payload: UpdateProfileInput = {};

    const name = username.trim();
    if (name !== user?.username) {
      if (name.length < 3 || name.length > 30) {
        errs.username = t('edit.usernameLength');
      } else {
        payload.username = name;
      }
    }

    const mail = email.trim();
    if (mail !== user?.email) {
      if (!/^\S+@\S+\.\S+$/.test(mail)) {
        errs.email = t('edit.emailInvalid');
      } else {
        payload.email = mail;
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
      return toast.show(t('edit.noChange'), 'info');
    }

    update.mutate(payload, {
      onSuccess: () => {
        toast.show(t('edit.saved'), 'success');
        router.back();
      },
      onError: (e) => setErrors({ [fieldOf(e)]: e.message }),
    });
  };

  return (
    <SubScreen title={t('edit.title')} onBack={() => router.back()}>
      <View className="gap-5 py-3 pb-10">
        <AvatarEditor username={user?.username ?? ''} avatarUrl={user?.avatarUrl} />

        <View className="gap-3">
          <Input
            label={t('edit.username')}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={errors.username}
          />
          <Input
            label={t('edit.email')}
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

        {errors.general ? (
          <Text color="danger" className="text-sm">
            {errors.general}
          </Text>
        ) : null}

        <Button label={t('edit.save')} loading={update.isPending} onPress={save} />

        <Card
          onPress={() => router.push('/profile/password')}
          className="flex-row items-center gap-3"
        >
          <Ionicons name="lock-closed-outline" size={20} color={colors.ink} />
          <Text className="flex-1">{t('edit.changePassword')}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Card>

        <RemindersCard />

        <DangerZone />
      </View>
    </SubScreen>
  );
}
