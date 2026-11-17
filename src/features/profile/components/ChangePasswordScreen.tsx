import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { PasswordRules } from '@/features/auth/components';
import { isPasswordValid } from '@/features/auth/lib/passwordRules';
import { Button, Input, SubScreen, Text, useToast } from '@/shared/ui';

import { useUpdateProfile } from '../hooks';

type Field = 'currentPassword' | 'newPassword' | 'confirm' | 'general';
type Errors = Partial<Record<Field, string>>;

/** Changement de mot de passe : actuel + nouveau (mêmes règles qu'à l'inscription) + confirmation. */
export function ChangePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const update = useUpdateProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const save = () => {
    const errs: Errors = {};
    if (!currentPassword) errs.currentPassword = 'Renseigne ton mot de passe actuel.';
    if (!isPasswordValid(newPassword))
      errs.newPassword = 'Le mot de passe ne respecte pas les règles.';
    if (newPassword !== confirm) errs.confirm = 'Les mots de passe ne correspondent pas.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    update.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.show('Mot de passe mis à jour', 'success');
          router.back();
        },
        // Le serveur ne peut refuser que le mot de passe actuel ou le nouveau.
        onError: (e) =>
          setErrors(
            /actuel/i.test(e.message) ? { currentPassword: e.message } : { general: e.message },
          ),
      },
    );
  };

  return (
    <SubScreen title="Changer le mot de passe" onBack={() => router.back()}>
      <View className="gap-4 py-3">
        <Input
          label="Mot de passe actuel"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          error={errors.currentPassword}
        />

        <View className="gap-2">
          <Input
            label="Nouveau mot de passe"
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
          label="Confirmer le nouveau mot de passe"
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

        <Button label="Mettre à jour" loading={update.isPending} onPress={save} />
      </View>
    </SubScreen>
  );
}
