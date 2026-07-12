import { Image, Text, View } from 'react-native';

import { config } from '@/shared/lib';
import { fonts } from '@/shared/theme';

import { initials } from '../lib/initials';

type Props = {
  username: string;
  avatarUrl?: string | null;
  /** Diamètre en points (défaut 96). */
  size?: number;
};

/** Avatar : photo si disponible, sinon initiales sur pastille violette. UI pure. */
export function Avatar({ username, avatarUrl, size = 96 }: Props) {
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-full bg-accent"
      style={{ width: size, height: size }}>
      {avatarUrl ? (
        <Image
          source={{ uri: `${config.apiBaseUrl}/uploads/avatars/${avatarUrl}` }}
          className="size-full"
          resizeMode="cover"
        />
      ) : (
        <Text
          allowFontScaling={false}
          className="text-center text-white"
          style={{
            // Incontournable en inline : dimensions dérivées de `size` (prop) + métriques
            // de police pour un centrage vertical net (cf. LineBadge). Pas d'équivalent classe.
            width: size,
            fontFamily: fonts.bold,
            fontSize: size * 0.4,
            lineHeight: size,
            textAlignVertical: 'center',
            includeFontPadding: false,
          }}>
          {initials(username)}
        </Text>
      )}
    </View>
  );
}
