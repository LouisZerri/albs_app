/**
 * Favoris des bons plans hors ligne : l'étoile réagit tout de suite, le changement part plus tard,
 * et le bandeau de synchronisation le compte. Vrai code de l'app ; seul le réseau est simulé.
 */
import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import { dehydrate, hydrate, onlineManager, type QueryClient } from '@tanstack/react-query';

process.env.EXPO_PUBLIC_API_URL = 'http://api.test';

const { createQueryClient, isAwaitingSync, isQueuedOffline, resumePendingMutations } =
  await import('@/shared/lib');
// Fichiers visés un par un : l'index des hooks tire aussi des composants d'interface.
const { registerToggleFavoriteMutation, TOGGLE_FAVORITE_KEY } =
  await import('@/features/bonplans/hooks/useToggleFavorite');
const { FAVORITES_KEY } = await import('@/features/bonplans/hooks/useFavorites');
const { stationBonplansKey } = await import('@/features/bonplans/hooks/useStationBonplans');

type Spot = { id: number; name: string; isFavorite: boolean };

let calls: string[];
const clients: QueryClient[] = [];

beforeEach(() => {
  calls = [];
  onlineManager.setOnline(true);
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    if (init.method === 'POST' || init.method === 'DELETE') {
      calls.push(`${init.method} ${String(url).replace('http://api.test', '')}`);
      return new Response(null, { status: 204 });
    }
    return new Response('[]', { status: 200 }); // rechargements
  }) as typeof fetch;
});

afterEach(async () => {
  onlineManager.setOnline(true);
  await new Promise((resolve) => setTimeout(resolve, 50));
  for (const client of clients.splice(0)) {
    client.clear();
    client.unmount();
  }
});

function newClient(): QueryClient {
  const client = createQueryClient();
  registerToggleFavoriteMutation(client);
  client.mount();
  clients.push(client);
  return client;
}

/** Un écran de station ouvert avec deux bons plans, et une liste de favoris vide. */
function seed(client: QueryClient, stationId: number, base: number) {
  client.setQueryData(stationBonplansKey(stationId), {
    station: { id: stationId },
    bonplans: [
      { id: base + 1, name: 'Café', isFavorite: false },
      { id: base + 2, name: 'Musée', isFavorite: false },
    ],
  });
  client.setQueryData(FAVORITES_KEY, []);
}

function toggle(client: QueryClient, bonplanId: number, favorite: boolean) {
  const options = client.defaultMutationOptions({ mutationKey: TOGGLE_FAVORITE_KEY });
  const mutation = client.getMutationCache().build(client, options);
  void mutation.execute({ bonplanId, favorite }).catch(() => undefined);
}

const settle = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const waitFor = async (condition: () => boolean, timeout = 8000) => {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeout) throw new Error('délai dépassé');
    await settle(20);
  }
};
const favorites = (client: QueryClient) =>
  ((client.getQueryData(FAVORITES_KEY) as Spot[]) ?? []).map((b) => b.id);
const starred = (client: QueryClient, stationId: number) =>
  (client.getQueryData(stationBonplansKey(stationId)) as { bonplans: Spot[] }).bonplans
    .filter((b) => b.isFavorite)
    .map((b) => b.id);
const queued = (client: QueryClient) =>
  client.getMutationCache().getAll().filter(isQueuedOffline).length;

test('hors ligne : l’étoile et la liste des favoris changent tout de suite, rien ne part', async () => {
  const client = newClient();
  seed(client, 10, 100);
  onlineManager.setOnline(false);

  toggle(client, 101, true);
  await settle();

  assert.deepEqual(starred(client, 10), [101]);
  assert.deepEqual(favorites(client), [101], 'le favori ajouté apparaît dans la liste');
  assert.equal(calls.length, 0);
  assert.equal(queued(client), 1, 'compté par le bandeau de synchronisation');
});

test('au retour du réseau : les changements partent dans l’ordre des taps', async () => {
  const client = newClient();
  seed(client, 20, 200);
  onlineManager.setOnline(false);

  toggle(client, 201, true);
  toggle(client, 202, true);
  toggle(client, 201, false);
  await settle();
  assert.deepEqual(starred(client, 20), [202]);
  assert.deepEqual(favorites(client), [202]);

  onlineManager.setOnline(true);
  await waitFor(() => calls.length === 3);
  assert.deepEqual(calls, [
    'POST /api/bonplans/201/favorite',
    'POST /api/bonplans/202/favorite',
    'DELETE /api/bonplans/201/favorite',
  ]);
});

test('app fermée hors ligne puis rouverte : le favori est retrouvé, compté, puis envoyé', async () => {
  const before = newClient();
  seed(before, 30, 300);
  onlineManager.setOnline(false);
  toggle(before, 301, true);
  await settle();

  // Tout passe par ce qui est écrit sur le disque, comme à un vrai redémarrage.
  const saved = JSON.parse(
    JSON.stringify(
      dehydrate(before, {
        shouldDehydrateQuery: (q) => q.state.status === 'success',
        shouldDehydrateMutation: isAwaitingSync,
      }),
    ),
  );
  before.clear();
  before.unmount();

  const after = newClient();
  hydrate(after, saved);
  assert.deepEqual(starred(after, 30), [301]);
  assert.equal(queued(after), 1, 'toujours compté par le bandeau après redémarrage');
  assert.equal(calls.length, 0);

  onlineManager.setOnline(true);
  resumePendingMutations(after);
  await waitFor(() => calls.length === 1);
  assert.deepEqual(calls, ['POST /api/bonplans/301/favorite']);
});
