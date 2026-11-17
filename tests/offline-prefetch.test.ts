/** Le préchargement du réseau : chaque ligne doit être disponible sous terre, sans gaspiller de requêtes. */
import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

const { createQueryClient, prefetchQueries } = await import('@/shared/lib');
const { prefetchNetwork } = await import('@/features/network/lib/offlinePrefetch');

const line = (id: number) => ({
  id,
  number: String(id),
  name: `Ligne ${id}`,
  color: '#000000',
  textColor: null,
  loop: null,
  stations: [],
});
const platforms = [
  { id: 1, name: 'A', lineId: 1 },
  { id: 2, name: 'B', lineId: 1 },
  { id: 3, name: 'A', lineId: 2 },
  { id: 4, name: 'C', lineId: 3 },
];

let requested: string[];
/** Chemins que « le serveur » fait échouer. */
let failing: Set<string>;

beforeEach(() => {
  requested = [];
  failing = new Set();
  globalThis.fetch = (async (url: string) => {
    const path = String(url).replace('http://api.test', '');
    requested.push(path);
    if (failing.has(path)) return new Response('{}', { status: 500 });
    if (path === '/api/network/platforms') return Response.json(platforms);
    if (path === '/api/network') return Response.json({ lines: [], stations: [] });
    return Response.json(line(Number(path.split('/').at(-1))));
  }) as typeof fetch;
});

test('télécharge l’index, chaque ligne une fois, puis la carte', async () => {
  const client = createQueryClient();

  const available = await prefetchNetwork(client);

  assert.equal(available, 3);
  assert.deepEqual(requested, [
    '/api/network/platforms',
    '/api/lines/1',
    '/api/lines/2',
    '/api/lines/3',
    '/api/network',
  ]);
  // Les écrans retrouvent ces données sous les clés qu'ils utilisent.
  assert.equal((client.getQueryData(['network', 'line', 2]) as { name: string }).name, 'Ligne 2');
  assert.ok(client.getQueryData(['network', 'geo']));
});

test('relancé alors que tout est à jour : aucune requête', async () => {
  const client = createQueryClient();
  await prefetchNetwork(client);
  requested = [];

  const available = await prefetchNetwork(client);

  assert.equal(available, 3);
  assert.deepEqual(requested, []);
});

test('une ligne en échec n’empêche pas les autres, et sera retentée', async () => {
  const client = createQueryClient();
  failing.add('/api/lines/2');

  const available = await prefetchNetwork(client);

  assert.equal(available, 2);
  assert.ok(
    client.getQueryData(['network', 'line', 3]),
    'la ligne suivante doit être chargée malgré l’échec',
  );

  failing.clear();
  requested = [];
  assert.equal(await prefetchNetwork(client), 3);
  assert.deepEqual(requested, ['/api/lines/2'], 'seule la ligne manquante est redemandée');
});

test('interrompu (réseau perdu) : s’arrête sans tout télécharger', async () => {
  const client = createQueryClient();
  let downloaded = 0;

  // Annulé dès qu'une première ligne est passée.
  const available = await prefetchNetwork(client, () => downloaded++ >= 1);

  assert.equal(available, 1);
  assert.ok(
    !requested.includes('/api/network'),
    'la carte ne doit pas être téléchargée après une interruption',
  );
});

test('autres onglets : chaque requête est préchargée une fois, un échec n’arrête pas la suite', async () => {
  const client = createQueryClient();
  const asked: string[] = [];
  const query = (name: string, fails = false) => ({
    queryKey: ['extra', name],
    queryFn: async () => {
      asked.push(name);
      if (fails) throw new Error('panne');
      return name;
    },
  });
  // `retry: false` : on teste l'enchaînement, pas la politique de réessai.
  client.setQueryDefaults(['extra'], { retry: false });
  const task = prefetchQueries([query('a'), query('b', true), query('c')]);

  await task(client, () => false);
  assert.deepEqual(asked, ['a', 'b', 'c']);
  assert.equal(client.getQueryData(['extra', 'c']), 'c');

  // Deuxième passage : seul l'échec est redemandé.
  await task(client, () => false);
  assert.deepEqual(asked, ['a', 'b', 'c', 'b']);

  // Interrompu d'emblée : rien n'est demandé.
  await task(client, () => true);
  assert.equal(asked.length, 4);
});
