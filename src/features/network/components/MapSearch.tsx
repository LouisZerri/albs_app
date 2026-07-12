import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { colors, fonts } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

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
  const q = query.trim().toLowerCase();
  const results = q.length >= 1 ? stations.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 8) : [];

  return (
    <View className="absolute inset-x-3 top-2">
      <View
        className="flex-row items-center gap-2.5 rounded-2xl border border-hair bg-surface px-4 py-3"
        style={SHADOW}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher une station…"
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          className="flex-1 text-ink"
          style={{ fontFamily: fonts.regular, fontSize: 15, padding: 0 }}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

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
