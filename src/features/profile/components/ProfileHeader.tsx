import { Text as RNText, View } from 'react-native';

import { LineBadge } from '@/features/network/components';
import { fonts } from '@/shared/theme';
import { Text } from '@/shared/ui';

import { rankFor } from '../lib/rank';
import { Avatar } from './Avatar';

type FavoriteLine = { number: string; color: string; textColor: string | null };

type Props = {
  username: string;
  email: string;
  avatarUrl?: string | null;
  createdAt?: string;
  favoriteLine?: FavoriteLine | null;
  /** Emojis des badges mis en avant (vitrine). */
  showcase?: string[];
  /** Engagement total (passé + descendu) → détermine le rang. */
  engagement: number;
};

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** En-tête sobre du profil : avatar, pseudo, rang, date d'inscription. UI pure. */
export function ProfileHeader({
  username,
  email,
  avatarUrl,
  createdAt,
  favoriteLine,
  showcase,
  engagement,
}: Props) {
  const rank = rankFor(engagement);
  const since = formatDate(createdAt);

  return (
    <View className="items-center gap-3 pt-2">
      <Avatar username={username} avatarUrl={avatarUrl} size={96} />

      <View className="items-center gap-2">
        <Text variant="title">{username}</Text>

        {/* Une seule ligne : badges en vitrine · rang · ligne favorite. */}
        <View className="flex-row flex-wrap items-center justify-center gap-2">
          {showcase?.map((icon, i) => (
            <RNText key={`${icon}-${i}`} className="text-2xl">
              {icon}
            </RNText>
          ))}

          <View
            className="flex-row items-center gap-1.5 rounded-pill px-4 py-1.5"
            style={{ backgroundColor: rank.bg }}>
            <Text className="text-sm">{rank.icon}</Text>
            <Text
              className="text-xs tracking-wide"
              style={{ color: rank.fg, fontFamily: fonts.bold }}>
              {rank.label}
            </Text>
          </View>

          {favoriteLine ? (
            <LineBadge
              number={favoriteLine.number}
              color={favoriteLine.color}
              textColor={favoriteLine.textColor}
              size={30}
            />
          ) : null}
        </View>
      </View>

      <View className="items-center gap-0.5">
        <Text variant="muted">{email}</Text>
        {since ? (
          <Text variant="muted" className="text-xs">
            Membre depuis {since}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
