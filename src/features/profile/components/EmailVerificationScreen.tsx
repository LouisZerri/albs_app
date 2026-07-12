import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useAuth } from '@/features/auth/store';
import { colors } from '@/shared/theme';
import { Button, Input, Screen, Text, TextLink, useToast } from '@/shared/ui';

import { useResendVerification, useVerifyEmail } from '../hooks';

/** Écran de vérification d'email depuis le profil : envoi du code + saisie. */
export function EmailVerificationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const resend = useResendVerification();
  const verify = useVerifyEmail();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sendCode = () => {
    resend.mutate(undefined, {
      onSuccess: () => toast.show('Code envoyé par email 📧', 'success'),
      onError: (e) => toast.show(e.message, 'error'),
    });
  };

  const submit = () => {
    if (!/^\d{6}$/.test(code)) return setError('Le code fait 6 chiffres.');
    setError(null);
    verify.mutate(
      { email: user?.email ?? '', code },
      {
        onSuccess: () => {
          toast.show('Adresse confirmée ✅', 'success');
          router.back();
        },
        onError: (e) => setError(e.message),
      },
    );
  };

  return (
    <Screen scroll>
      <View className="flex-row items-center gap-3 py-2">
        <Pressable onPress={() => router.back()} className="p-1 active:opacity-60">
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text variant="subtitle">Vérifier mon adresse</Text>
      </View>

      <View className="gap-5 py-3">
        <Text variant="muted">
          On envoie un code à 6 chiffres à{' '}
          <Text variant="muted" color="ink">
            {user?.email ?? ''}
          </Text>
          . Saisis-le ci-dessous pour confirmer ton adresse.
        </Text>

        <Button
          label="Envoyer le code par email"
          variant="secondary"
          loading={resend.isPending}
          onPress={sendCode}
        />

        <Input
          label="Code reçu par email"
          value={code}
          onChangeText={setCode}
          error={error ?? undefined}
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
        />

        <Button label="Confirmer" loading={verify.isPending} onPress={submit} />

        <View className="items-center">
          <TextLink label="Renvoyer le code" onPress={sendCode} />
        </View>
      </View>
    </Screen>
  );
}
