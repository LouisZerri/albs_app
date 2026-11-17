import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/shared/lib';
import { useThemeColors } from '@/shared/theme';
import { Button, Input, Text, TextLink } from '@/shared/ui';

import { useForgotPassword } from '../hooks';
import { loginInputSchema } from '../types';

/** Formulaire « mot de passe oublié » : envoie l'email de réinitialisation. */
export function ForgotPasswordForm() {
  const colors = useThemeColors();
  const router = useRouter();
  const { mutate, isPending, isSuccess, error } = useForgotPassword();

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string>();

  const submit = () => {
    const parsed = loginInputSchema.shape.email.safeParse(email.trim());
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    mutate(parsed.data);
  };

  if (isSuccess) {
    return (
      <View className="gap-7">
        <View className="items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-accentSoft">
            <Ionicons name="mail-outline" size={30} color={colors.accent} />
          </View>
          <View className="items-center gap-1.5">
            <Text variant="subtitle" className="text-center">
              Vérifie tes emails
            </Text>
            <Text variant="muted" className="text-center">
              Si un compte existe pour cette adresse, un code de réinitialisation vient d’être envoyé.
              Pense à regarder tes spams.
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <Button
            label="J’ai reçu mon code"
            onPress={() =>
              router.push({ pathname: '/reset-password', params: { email: email.trim() } })
            }
          />
          <View className="items-center">
            <TextLink label="Retour à la connexion" onPress={() => router.replace('/login')} />
          </View>
        </View>
      </View>
    );
  }

  const apiMessage = error
    ? error instanceof ApiError
      ? error.message
      : 'Envoi impossible. Réessaie.'
    : null;

  return (
    <View className="gap-6">
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        error={fieldError}
        placeholder="toi@exemple.fr"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label="Envoyer le lien" onPress={submit} loading={isPending} />

      <View className="flex-row items-center justify-center gap-1.5">
        <Text variant="muted">Tu t’en souviens ?</Text>
        <TextLink label="Se connecter" onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
