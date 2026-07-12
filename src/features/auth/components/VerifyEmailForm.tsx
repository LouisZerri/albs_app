import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/shared/lib';
import { Button, Input, Text, TextLink, useToast } from '@/shared/ui';

import { useVerifyEmail } from '../hooks';
import { loginInputSchema } from '../types';

type FieldErrors = { email?: string; code?: string };

/** Formulaire de confirmation d'adresse email via code à 6 chiffres. */
export function VerifyEmailForm({ initialEmail = '' }: { initialEmail?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { mutate, isPending, error } = useVerifyEmail();

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const submit = () => {
    const errors: FieldErrors = {};
    if (!loginInputSchema.shape.email.safeParse(email.trim()).success) {
      errors.email = 'Email invalide.';
    }
    if (!/^\d{6}$/.test(code)) errors.code = 'Le code fait 6 chiffres.';

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    mutate(
      { email: email.trim(), code },
      {
        onSuccess: () => {
          toast.show('Adresse confirmée, ton compte est activé.', 'success');
          router.replace('/login');
        },
      },
    );
  };

  const apiMessage = error
    ? error instanceof ApiError
      ? error.message
      : 'Vérification impossible. Réessaie.'
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
      </View>

      {apiMessage ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiMessage}
        </Text>
      ) : null}

      <Button label="Confirmer mon adresse" onPress={submit} loading={isPending} />

      <View className="items-center">
        <TextLink label="Plus tard" onPress={() => router.replace('/login')} />
      </View>
    </View>
  );
}
