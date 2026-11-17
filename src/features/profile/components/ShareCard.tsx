import { LinearGradient } from 'expo-linear-gradient';
import type { Ref } from 'react';
import { Image, View, type HostInstance } from 'react-native';

import { LineBadge } from '@/features/network/components';
import type { NetworkStats } from '@/features/network/types';
import { Text } from '@/shared/ui';

import { rankFor } from '../lib/rank';

// Logo « hub coloré » (même image que l'icône d'app).
const LOGO = require('../../../../assets/images/icon.png');
// Couleurs FIXES (dégradé violet de la marque) : l'image partagée est la même en thème clair et sombre.
const GRADIENT = ['#7C3AED', '#5B21B6'] as const;

type Props = {
  /** Réf. de la vue capturée en image. */
  captureRef: Ref<HostInstance>;
  username: string;
  stats: NetworkStats;
  /** « depuis le 7 juillet 2026 » ; absent si l'historique n'est pas disponible. */
  since?: string;
};

/** La carte-souvenir à partager : progression globale, rang et état de chaque ligne. UI pure. */
export function ShareCard({ captureRef, username, stats, since }: Props) {
  const rank = rankFor(stats.stations.visited);

  return (
    // collapsable={false} : indispensable sur Android pour que la vue existe et soit capturable.
    <View ref={captureRef} collapsable={false} className="overflow-hidden rounded-card">
      <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View className="gap-5 p-6">
          <View className="flex-row items-center gap-3">
            <Image source={LOGO} className="h-10 w-10 rounded-md" />
            <Text variant="subtitle" color="white">
              À la bonne station
            </Text>
          </View>

          <View>
            <Text color="white" style={{ fontSize: 64, lineHeight: 70 }} variant="title">
              {stats.stations.visited}
            </Text>
            <Text variant="subtitle" color="white">
              {stats.stations.visited > 1 ? 'stations visitées' : 'station visitée'}
            </Text>
            <Text color="white" style={{ opacity: 0.85 }}>
              {stats.percent} % du métro parisien · {rank.icon} {rank.label}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-y-3">
            {stats.lines.map((line) => (
              // 4 lignes par rangée. Une ligne pas encore entamée est estompée.
              <View
                key={line.id}
                className="w-1/4 items-center gap-1"
                style={{ opacity: line.visited > 0 ? 1 : 0.35 }}
              >
                <LineBadge
                  number={line.number}
                  color={line.color}
                  textColor={line.textColor}
                  size={34}
                />
                <Text color="white" style={{ fontSize: 12 }}>
                  {line.percent} %
                </Text>
              </View>
            ))}
          </View>

          <Text color="white" style={{ fontSize: 12, opacity: 0.75 }}>
            {username}
            {since ? ` · depuis le ${since}` : ''}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
