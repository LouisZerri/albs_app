import { colors, radius } from './tokens';

export { colors, radius };

/**
 * Familles Montserrat (chaque poids = une police à part en React Native).
 * Les noms correspondent aux exports de `@expo-google-fonts/montserrat`.
 */
export const fonts = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  extrabold: 'Montserrat_800ExtraBold',
} as const;

export type ThemeColor = keyof typeof colors;
