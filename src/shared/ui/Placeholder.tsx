import { View } from 'react-native';

import { Screen } from './Screen';
import { Text } from './Text';

type Props = {
  /** Nom de l'écran (ex. « Bons plans »). */
  title: string;
  /** Petite phrase d'attente. */
  subtitle?: string;
};

/** Écran temporaire « à venir », le temps de construire chaque feature. */
export function Placeholder({ title, subtitle = 'Bientôt disponible' }: Props) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-2">
        <Text variant="title">{title}</Text>
        <Text variant="muted">{subtitle}</Text>
      </View>
    </Screen>
  );
}
