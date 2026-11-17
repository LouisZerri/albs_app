import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { isNetworkError } from '@/shared/lib';
import { useThemeColors } from '@/shared/theme';

import { Button } from './Button';
import { Text } from './Text';

type Props = {
  /** L'erreur de la requête : sert à distinguer l'absence de réseau d'une vraie panne. */
  error: unknown;
  /** Message affiché quand ce n'est PAS un problème de réseau (ex. « Impossible de charger la ligne. »). */
  message: string;
  onRetry: () => void;
  /** Ajoute un bouton « Retour » (écrans sans autre moyen de revenir en arrière). */
  onBack?: () => void;
};

/**
 * État d'erreur d'un écran de données. Sans réseau (cas courant dans le métro), on le dit
 * clairement plutôt que de laisser croire à une panne de l'app. UI pure.
 */
export function ErrorState({ error, message, onRetry, onBack }: Props) {
  const colors = useThemeColors();
  const offline = isNetworkError(error);

  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Ionicons
        name={offline ? 'cloud-offline-outline' : 'alert-circle-outline'}
        size={36}
        color={colors.muted}
      />
      <View className="items-center gap-1">
        {offline ? <Text variant="subtitle">Pas de connexion</Text> : null}
        <Text variant="muted" className="text-center">
          {offline ? 'Réessaie dès que tu retrouves du réseau, en station par exemple.' : message}
        </Text>
      </View>
      <Button label="Réessayer" variant="secondary" onPress={onRetry} />
      {onBack ? <Button label="Retour" variant="ghost" onPress={onBack} /> : null}
    </View>
  );
}
