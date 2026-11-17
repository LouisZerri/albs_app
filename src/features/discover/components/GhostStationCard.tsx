import { View } from 'react-native';

import { Card, Text } from '@/shared/ui';

import type { GhostStation } from '../types';

/** Une station fantôme : son histoire si elle est débloquée, sinon l'indice pour y arriver. UI pure. */
export function GhostStationCard({ ghost }: { ghost: GhostStation }) {
  return (
    <Card className="flex-row gap-3">
      <Text style={{ fontSize: 26, lineHeight: 32, opacity: ghost.unlocked ? 1 : 0.4 }}>
        {ghost.unlocked ? '👻' : '🔒'}
      </Text>

      <View className="flex-1 gap-1">
        <Text variant="subtitle">{ghost.name}</Text>
        <Text variant="label">{ghost.lines}</Text>
        {ghost.unlocked && ghost.story ? (
          <Text>{ghost.story}</Text>
        ) : (
          <Text variant="muted">
            Pour la débloquer, descends à {ghost.unlockedBy.join(' et à ')}.
            {ghost.missing.length < ghost.unlockedBy.length
              ? ` Il te manque ${ghost.missing.join(' et ')}.`
              : ''}
          </Text>
        )}
      </View>
    </Card>
  );
}
