import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { PasswordRules } from '@/features/auth/components';
import { isPasswordValid } from '@/features/auth/lib/passwordRules';
import { useTranslation } from '@/i18n';
import { ApiError } from '@/shared/lib';
import { Button, Input, SubScreen, Text, useToast } from '@/shared/ui';

import { useUpdateProfile } from '../hooks';

type Field = 'currentPassword' | 'newPassword' | 'confirm' | 'general';
type Errors = Partial<Record<Field, string>>;

/** Changement de mot de passe : actuel + nouveau (mêmes règles qu'à l'inscription) + confirmation. */
export function ChangePasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const toast = useToast();
  const update = useUpdateProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const save = () => {
    const errs: Errors = {};
    if (!currentPassword) errs.currentPassword = t('password.currentRequired');
    if (!isPasswordValid(newPassword)) errs.newPassword = t('password.rulesNotMet');
    if (newPassword !== confirm) errs.confirm = t('password.mismatch');
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    update.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.show(t('password.updated'), 'success');
          router.back();
        },
        // Le serveur ne peut refuser que le mot de passe actuel ou le nouveau.
        onError: (e) =>
          setErrors(
            e instanceof ApiError && e.field === 'currentPassword'
              ? { currentPassword: e.message }
              : { general: e.message },
          ),
      },
    );
  };

  return (
    <SubScreen title={t('password.title')} onBack={() => router.back()}>
      <View className="gap-4 py-3">
        <Input
          label={t('password.current')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          error={errors.currentPassword}
        />

        <View className="gap-2">
          <Input
            label={t('password.new')}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.newPassword}
          />
          {newPassword.length > 0 ? <PasswordRules value={newPassword} /> : null}
        </View>

        <Input
          label={t('password.confirm')}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          error={errors.confirm}
        />

        {errors.general ? (
          <Text variant="muted" color="danger" className="text-center">
            {errors.general}
          </Text>
        ) : null}

        <Button label={t('password.submit')} loading={update.isPending} onPress={save} />
      </View>
    </SubScreen>
  );
}
