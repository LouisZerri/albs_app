import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/shared/lib';
import { Button, Input, Text, TextLink } from '@/shared/ui';

import { useLogin } from '../hooks';
import { loginInputSchema } from '../types';

type FieldErrors = { email?: string; password?: string };

function messageFor(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message === 'Invalid credentials.'
      ? 'E-mail ou mot de passe incorrect.'
      : error.message;
  }
  return 'Connexion impossible. Réessaie.';
}

/** Formulaire de connexion. La redirection après succès est gérée par le routing racine. */
export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const parsed = loginInputSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: f.email?.[0], password: f.password?.[0] });
      return;
    }
    setFieldErrors({});
    mutate(parsed.data);
  };

  const apiMessage = error ? messageFor(error) : null;

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
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </View>

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label="Se connecter" onPress={submit} loading={isPending} />

      <View className="items-center gap-3">
        <TextLink label="Mot de passe oublié ?" onPress={() => router.push('/forgot-password')} />
        <View className="flex-row items-center gap-1.5">
          <Text variant="muted">Pas encore de compte ?</Text>
          <TextLink label="S'inscrire" onPress={() => router.push('/register')} />
        </View>
      </View>
    </View>
  );
}
