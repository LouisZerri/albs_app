/** Position d'une station sur la carte selon la ligne mise en avant. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { stationPosition } = await import('@/features/network/lib/stationPosition');

const badge = (lineId: number, at?: { lat: number; lng: number }) => ({
  lineId,
  number: String(lineId),
  color: '#000000',
  textColor: null,
  ...at,
});
const station = (lines: ReturnType<typeof badge>[]) => ({
  id: 1,
  name: 'Montparnasse - Bienvenüe',
  lat: 48.8422,
  lng: 2.3209,
  lines,
  bonplanCount: 0,
  fact: null,
});

test('sans ligne mise en avant : le point commun de la station', () => {
  const hub = station([
    badge(4, { lat: 48.8438, lng: 2.3245 }),
    badge(6, { lat: 48.842, lng: 2.3203 }),
  ]);
  assert.deepEqual(stationPosition(hub, null), { lat: 48.8422, lng: 2.3209 });
});

test('ligne mise en avant : la position de la station sur cette ligne', () => {
  const hub = station([
    badge(4, { lat: 48.8438, lng: 2.3245 }),
    badge(6, { lat: 48.842, lng: 2.3203 }),
  ]);
  assert.deepEqual(stationPosition(hub, 4), { lat: 48.8438, lng: 2.3245 });
});

test('station d’une seule ligne, ou ligne qui ne la dessert pas : le point commun', () => {
  const single = station([badge(4)]);
  assert.deepEqual(stationPosition(single, 4), { lat: 48.8422, lng: 2.3209 });
  assert.deepEqual(stationPosition(single, 9), { lat: 48.8422, lng: 2.3209 });
});
