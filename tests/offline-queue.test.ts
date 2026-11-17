/**
 * La file de cochages hors ligne : rien ne doit se perdre.
 * Ces tests exécutent le vrai code de l'app (client de requêtes, cochage, appels API) ; seuls le
 * réseau (fetch) et les modules natifs sont simulés.
 */
import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

import { dehydrate, hydrate, onlineManager, type QueryClient } from '@tanstack/react-query';

process.env.EXPO_PUBLIC_API_URL = 'http://api.test';

const { createQueryClient, isAwaitingSync, resumePendingMutations } = await import('@/shared/lib');
const { registerToggleStationMutation, TOGGLE_STATION_KEY } =
  await import('@/features/network/hooks/useToggleStation');
const PROGRESS_KEY = ['network', 'progress'];

type Call = { url: string; body: { passed: boolean; stopped: boolean; at: string } };
let calls: Call[];
/** Ce que « le serveur » répond : 'ok', 'down' (réseau coupé en plein envoi) ou un code d'erreur. */
let server: 'ok' | 'down' | number;

beforeEach(() => {
  calls = [];
  server = 'ok';
  onlineManager.setOnline(true);
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    if (init.method !== 'PUT') return new Response('[]', { status: 200 }); // rechargements
    if (server === 'down') throw new TypeError('Network request failed');
    calls.push({ url: String(url), body: JSON.parse(String(init.body)) });
    if (server !== 'ok')
      return new Response(JSON.stringify({ message: 'refusé' }), { status: server });
    return new Response(
      JSON.stringify({ progress: { stationId: 1, passed: true, stopped: true }, newBadges: [] }),
      {
        status: 200,
      },
    );
  }) as typeof fetch;
});

afterEach(async () => {
  // Aucun envoi d'un test ne doit déborder sur le suivant.
  server = 'ok';
  onlineManager.setOnline(true);
  await new Promise((resolve) => setTimeout(resolve, 50));
  for (const client of clients.splice(0)) {
    client.clear();
    client.unmount();
  }
});

const clients: QueryClient[] = [];

/** Les envois du test en cours : ceux qui visent ses stations (numérotées base+…). */
const sent = (base: number) =>
  calls.filter((c) => {
    const id = Number(c.url.split('/').at(-2));
    return id >= base && id < base + 100;
  });

function newClient(): QueryClient {
  const client = createQueryClient();
  registerToggleStationMutation(client);
  client.mount(); // comme le fait le fournisseur React : écoute le retour du réseau
  clients.push(client);
  return client;
}

/** Coche une station comme le fait le hook : variables datées du moment du tap. */
function toggle(
  client: QueryClient,
  stationId: number,
  passed: boolean,
  stopped: boolean,
  at: string,
) {
  // Comme le hook : les réglages déclarés pour cette clé sont appliqués à la mutation.
  const options = client.defaultMutationOptions({ mutationKey: TOGGLE_STATION_KEY });
  const mutation = client.getMutationCache().build(client, options);
  void mutation.execute({ stationId, passed, stopped, at }).catch(() => undefined);
}

const settle = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const waitFor = async (condition: () => boolean, timeout = 8000) => {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeout) throw new Error('délai dépassé');
    await settle(20);
  }
};
const progress = (client: QueryClient) =>
  (client.getQueryData(PROGRESS_KEY) as {
    stationId: number;
    passed: boolean;
    stopped: boolean;
  }[]) ?? [];

/** Simule la fermeture puis la réouverture de l'app : tout passe par ce qui est écrit sur le disque. */
function restart(client: QueryClient): QueryClient {
  const saved = JSON.parse(
    JSON.stringify(
      dehydrate(client, {
        shouldDehydrateQuery: (q) => q.state.status === 'success',
        shouldDehydrateMutation: isAwaitingSync,
      }),
    ),
  );
  // L'ancienne instance disparaît (comme un processus tué) : elle ne doit plus rien renvoyer.
  client.clear();
  client.unmount();

  const next = newClient();
  hydrate(next, saved);
  return next;
}

test('hors ligne : le cochage s’affiche tout de suite et rien ne part', async () => {
  const client = newClient();
  client.setQueryData(PROGRESS_KEY, []);
  onlineManager.setOnline(false);

  toggle(client, 112, true, true, '2026-11-17T08:00:00.000Z');
  await settle();

  assert.deepEqual(progress(client), [{ stationId: 112, passed: true, stopped: true }]);
  assert.equal(sent(100).length, 0);
  assert.equal(client.isMutating({ mutationKey: TOGGLE_STATION_KEY }), 1);
});

test('au retour du réseau : les cochages partent dans l’ordre des taps, avec l’heure du tap', async () => {
  const client = newClient();
  client.setQueryData(PROGRESS_KEY, []);
  onlineManager.setOnline(false);

  toggle(client, 212, true, false, '2026-11-17T08:00:00.000Z');
  toggle(client, 212, true, true, '2026-11-17T08:00:05.000Z');
  toggle(client, 240, true, true, '2026-11-17T08:03:00.000Z');
  await settle();
  assert.equal(sent(200).length, 0);

  onlineManager.setOnline(true);
  await waitFor(() => sent(200).length === 3);

  assert.deepEqual(
    sent(200).map((c) => [c.url, c.body.stopped, c.body.at]),
    [
      ['http://api.test/api/stations/212/progress', false, '2026-11-17T08:00:00.000Z'],
      ['http://api.test/api/stations/212/progress', true, '2026-11-17T08:00:05.000Z'],
      ['http://api.test/api/stations/240/progress', true, '2026-11-17T08:03:00.000Z'],
    ],
  );
  await waitFor(() => client.isMutating({ mutationKey: TOGGLE_STATION_KEY }) === 0);
});

test('app fermée hors ligne puis rouverte : l’affichage et la file sont retrouvés, puis envoyés', async () => {
  const before = newClient();
  before.setQueryData(PROGRESS_KEY, []);
  onlineManager.setOnline(false);
  toggle(before, 312, true, true, '2026-11-17T08:00:00.000Z');
  toggle(before, 340, true, false, '2026-11-17T08:02:00.000Z');
  await settle();

  const after = restart(before);

  // L'affichage est le même qu'avant la fermeture, toujours sans réseau.
  assert.deepEqual(progress(after), [
    { stationId: 312, passed: true, stopped: true },
    { stationId: 340, passed: true, stopped: false },
  ]);
  resumePendingMutations(after);
  await settle();
  assert.equal(sent(300).length, 0, 'rien ne doit partir tant que le réseau est coupé');

  onlineManager.setOnline(true);
  await waitFor(() => sent(300).length === 2);
  assert.deepEqual(
    sent(300).map((c) => [c.url.split('/').at(-2), c.body.at]),
    [
      ['312', '2026-11-17T08:00:00.000Z'],
      ['340', '2026-11-17T08:02:00.000Z'],
    ],
  );
});

test('app fermée PENDANT un envoi qui échoue : le cochage n’est pas perdu', async () => {
  const before = newClient();
  before.setQueryData(PROGRESS_KEY, []);
  server = 'down'; // le téléphone se croit en ligne, mais la requête n'aboutit pas
  toggle(before, 412, true, true, '2026-11-17T08:00:00.000Z');
  await settle();

  const after = restart(before); // tué en plein envoi
  server = 'ok';
  resumePendingMutations(after);

  await waitFor(() => sent(400).length === 1);
  assert.equal(sent(400)[0].body.at, '2026-11-17T08:00:00.000Z');
  assert.deepEqual(progress(after), [{ stationId: 412, passed: true, stopped: true }]);
});

test('réseau instable : l’envoi est retenté jusqu’à réussir', async () => {
  const client = newClient();
  client.setQueryData(PROGRESS_KEY, []);
  server = 'down';
  toggle(client, 512, true, true, '2026-11-17T08:00:00.000Z');
  await settle(200);
  assert.equal(sent(500).length, 0);

  server = 'ok';
  await waitFor(() => sent(500).length === 1);
});

test('refus définitif du serveur (4xx) : pas de boucle, l’app recharge la vérité', async () => {
  const client = newClient();
  client.setQueryData(PROGRESS_KEY, []);
  server = 404;
  toggle(client, 699, true, true, '2026-11-17T08:00:00.000Z');

  await waitFor(() => client.isMutating({ mutationKey: TOGGLE_STATION_KEY }) === 0);
  await settle(100);

  assert.equal(sent(600).length, 1, 'un refus ne doit pas être retenté');
  assert.equal(client.getQueryState(PROGRESS_KEY)?.isInvalidated, true);
});

test('serveur qui demande de ralentir (429) : le cochage est renvoyé, pas perdu', async () => {
  const client = newClient();
  client.setQueryData(PROGRESS_KEY, []);
  server = 429;
  toggle(client, 712, true, true, '2026-11-17T08:00:00.000Z');
  await waitFor(() => sent(700).length === 1);
  assert.equal(client.isMutating({ mutationKey: TOGGLE_STATION_KEY }), 1, 'toujours en file');

  server = 'ok';
  await waitFor(() => client.isMutating({ mutationKey: TOGGLE_STATION_KEY }) === 0);
  assert.equal(sent(700).length, 2);
});
