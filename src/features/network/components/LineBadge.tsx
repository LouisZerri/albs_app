import { Text, View } from 'react-native';

import { fonts } from '@/shared/theme';

type Props = {
  number: string;
  color: string;
  textColor: string | null;
  size?: number;
};

/** Pastille de ligne ronde et de taille FIXE ; le chiffre est parfaitement centré. */
export function LineBadge({ number, color, textColor, size = 36 }: Props) {
  // Police plus petite dès que le label dépasse 2 caractères (ex. « 3bis »).
  const fontSize = number.length <= 2 ? size * 0.44 : size * 0.3;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ backgroundColor: color, width: size, height: size }}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        allowFontScaling={false}
        style={{
          width: size,
          color: textColor ?? '#FFFFFF',
          fontFamily: fonts.bold,
          fontSize,
          lineHeight: size,
          textAlign: 'center',
          textAlignVertical: 'center',
          includeFontPadding: false,
        }}>
        {number}
      </Text>
    </View>
  );
}
