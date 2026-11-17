import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { SearchInput, Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { normalizeSearch } from '@/shared/utils/normalizeSearch';

import type { MapStation } from '../types';

const SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};

/** Recherche d'une station sur la carte. Résultats → onSelect (centrage + sélection). */
export function MapSearch({
  stations,
  onSelect,
}: {
  stations: MapStation[];
  onSelect: (station: MapStation) => void;
}) {
  const [query, setQuery] = useState('');
  const q = normalizeSearch(query);
  const results = q.length >= 1 ? stations.filter((s) => normalizeSearch(s.name).includes(q)).slice(0, 8) : [];

  return (
    <View className="absolute inset-x-3 top-2">
      <SearchInput value={query} onChangeText={setQuery} placeholder="Rechercher une station…" style={SHADOW} />

      {results.length > 0 ? (
        <View
          className="mt-2 overflow-hidden rounded-2xl border border-hair bg-surface"
          style={SHADOW}>
          {results.map((s, i) => (
            <Pressable
              key={s.id}
              onPress={() => {
                onSelect(s);
                setQuery('');
              }}
              className={cn(
                'px-4 py-3 active:bg-hair/40',
                i < results.length - 1 && 'border-b border-hair',
              )}>
              <Text numberOfLines={1}>{s.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
