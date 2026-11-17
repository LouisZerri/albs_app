import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useThemeColors } from '@/shared/theme';
import { Text, useToast } from '@/shared/ui';

import { useDeleteAvatar, useUploadAvatar } from '../hooks';
import { Avatar } from './Avatar';

type Props = { username: string; avatarUrl?: string | null };

/** Bloc d'édition de l'avatar : aperçu + changer la photo / supprimer. */
export function AvatarEditor({ username, avatarUrl }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation('profile');
  const upload = useUploadAvatar();
  const remove = useDeleteAvatar();
  const toast = useToast();
  const busy = upload.isPending || remove.isPending;

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toast.show(t('avatar.permissionDenied'), 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    upload.mutate(
      {
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      },
      {
        onSuccess: () => toast.show(t('avatar.updated'), 'success'),
        onError: (e) => toast.show(e.message, 'error'),
      },
    );
  };

  const clear = () => {
    remove.mutate(undefined, {
      onSuccess: () => toast.show(t('avatar.removed'), 'success'),
      onError: (e) => toast.show(e.message, 'error'),
    });
  };

  return (
    <View className="items-center gap-3">
      <View>
        <Avatar username={username} avatarUrl={avatarUrl} size={104} />
        {busy ? (
          <View className="absolute inset-0 items-center justify-center rounded-full bg-black/30">
            <ActivityIndicator color={colors.white} />
          </View>
        ) : null}
      </View>

      <View className="flex-row items-center gap-4">
        <Pressable onPress={pick} disabled={busy} className="active:opacity-60">
          <Text variant="subtitle" color="accent" className="text-sm">
            {avatarUrl ? t('avatar.change') : t('avatar.add')}
          </Text>
        </Pressable>

        {avatarUrl ? (
          <Pressable onPress={clear} disabled={busy} className="active:opacity-60">
            <Text variant="subtitle" color="danger" className="text-sm">
              {t('avatar.remove')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
