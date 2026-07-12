import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/shared/lib';
import { Button, Input, Text, TextLink, useToast } from '@/shared/ui';

import { useResetPassword } from '../hooks';
import { isPasswordValid } from '../lib/passwordRules';
import { loginInputSchema } from '../types';
import { PasswordRules } from './PasswordRules';

type FieldErrors = { email?: string; code?: string; password?: string; confirm?: string };

/** Formulaire de réinitialisation : email + code reçu + nouveau mot de passe. */
export function ResetPasswordForm({ initialEmail = '' }: { initialEmail?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { mutate, isPending, error } = useResetPassword();

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const errors: FieldErrors = {};
    if (!loginInputSchema.shape.email.safeParse(email.trim()).success) {
      errors.email = 'Email invalide.';
    }
    if (!/^\d{6}$/.test(code)) errors.code = 'Le code fait 6 chiffres.';
    if (!isPasswordValid(password)) errors.password = 'Le mot de passe ne respecte pas les règles.';
    if (password !== confirm) errors.confirm = 'Les mots de passe ne correspondent pas.';

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    mutate(
      { email: email.trim(), code, password },
      {
        onSuccess: () => {
          toast.show('Mot de passe modifié, tu peux te connecter.', 'success');
          router.replace('/login');
        },
      },
    );
  };

  const apiMessage = error
    ? error instanceof ApiError
      ? error.message
      : 'Réinitialisation impossible. Réessaie.'
    : null;

  return (
    <View className="gap-6">
      <View className="gap-4">
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          placeholder="toi@exemple.fr"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <Input
          label="Code reçu par email"
          value={code}
          onChangeText={setCode}
          error={fieldErrors.code}
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
        />
        <View className="gap-2">
          <Input
            label="Nouveau mot de passe"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {password.length > 0 ? <PasswordRules value={password} /> : null}
        </View>
        <Input
          label="Confirmer le mot de passe"
          value={confirm}
          onChangeText={setConfirm}
          error={fieldErrors.confirm}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />
      </View>

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label="Réinitialiser" onPress={submit} loading={isPending} />

      <View className="flex-row items-center justify-center gap-1.5">
        <Text variant="muted">Retour à la</Text>
        <TextLink label="connexion" onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
