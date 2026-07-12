import { View } from 'react-native';

import type { Correspondence } from '../types';

/** Petites pastilles des lignes en correspondance à une station. UI pure. */
export function CorrespondenceDots({ items }: { items: Correspondence[] }) {
  if (items.length === 0) return null;

  return (
    <View className="flex-row items-center gap-1">
      {items.slice(0, 6).map((c) => (
        <View
          key={c.lineId}
          className="h-3 w-3 rounded-full border border-hair"
          style={{ backgroundColor: c.color }}
        />
      ))}
    </View>
  );
}
