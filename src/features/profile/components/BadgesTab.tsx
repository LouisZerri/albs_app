import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { useAuth } from '@/features/auth/store';
import { Text, useToast } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import { useToggleDisplayBadge } from '../hooks';
import type { BadgeStatus } from '../types';
import { BadgeStatRow } from './BadgeStatRow';

type Section = 'earned' | 'locked';

/** Onglet Badges : sous-filtre Débloqués / À débloquer + vitrine (max 2). */
export function BadgesTab({ badges }: { badges: BadgeStatus[] }) {
  const { user } = useAuth();
  const toggleDisplay = useToggleDisplayBadge();
  const toast = useToast();
  const [section, setSection] = useState<Section>('earned');

  const displayedIds = user?.displayedBadges ?? [];

  const { earned, locked } = useMemo(
    () => ({
      earned: badges.filter((b) => b.earned),
      // Les plus proches du déblocage en premier.
      locked: badges.filter((b) => !b.earned).sort((a, b) => b.progress - a.progress),
    }),
    [badges],
  );

  const toggle = (badgeId: number) => {
    toggleDisplay.mutate(badgeId, { onError: (e) => toast.show(e.message, 'error') });
  };

  const shown = section === 'earned' ? earned : locked;

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        <SubTab
          label={`✅ Débloqués (${earned.length})`}
          active={section === 'earned'}
          onPress={() => setSection('earned')}
        />
        <SubTab
          label={`🔒 À débloquer (${locked.length})`}
          active={section === 'locked'}
          onPress={() => setSection('locked')}
        />
      </View>

      {section === 'earned' && earned.length > 0 ? (
        <Text variant="muted" className="text-xs">
          Touche l&apos;étoile ⭐ pour mettre jusqu&apos;à 2 badges en avant sur ton profil.
        </Text>
      ) : null}

      {shown.length > 0 ? (
        shown.map((badge) => (
          <BadgeStatRow
            key={badge.id}
            badge={badge}
            displayed={displayedIds.includes(badge.id)}
            onToggleDisplay={section === 'earned' ? () => toggle(badge.id) : undefined}
          />
        ))
      ) : (
        <Text variant="muted" className="py-6 text-center">
          {section === 'earned' ? 'Aucun badge débloqué pour le moment.' : 'Tous les badges sont débloqués ! 🎉'}
        </Text>
      )}
    </View>
  );
}

function SubTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 items-center rounded-card border py-2',
        active ? 'border-transparent bg-accentSoft' : 'border-hair bg-surface',
      )}>
      <Text
        variant={active ? 'subtitle' : 'muted'}
        color={active ? 'accent' : undefined}
        className="text-xs">
        {label}
      </Text>
    </Pressable>
  );
}
