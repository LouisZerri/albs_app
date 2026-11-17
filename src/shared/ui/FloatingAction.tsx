import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/shared/theme';

import { Text } from './Text';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

/** Bouton d'action flottant (en bas à droite, au-dessus de la barre d'accueil), à portée de pouce. UI pure. */
export function FloatingAction({ icon, label, onPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="absolute right-5 h-14 flex-row items-center gap-2 rounded-full bg-accent px-5 active:opacity-80"
      style={{
        bottom: insets.bottom + 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
    >
      <Ionicons name={icon} size={22} color={colors.white} />
      <Text color="white" style={{ fontFamily: fonts.semibold }}>
        {label}
      </Text>
    </Pressable>
  );
}
