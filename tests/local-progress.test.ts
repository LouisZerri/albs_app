/** Les règles de progression appliquées sur le téléphone doivent donner ce que donnerait le serveur. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { applyToggle, deriveStats } = await import('@/features/network/lib/localProgress');

// Mini-réseau : Châtelet est sur les lignes 1 et 4 (correspondance), les autres stations sur une seule.
const platforms = [
  { id: 1, name: 'Châtelet', lineId: 1 },
  { id: 2, name: 'Louvre', lineId: 1 },
  { id: 3, name: 'Châtelet', lineId: 4 },
  { id: 4, name: 'Cité', lineId: 4 },
];
const sorted = (entries: { stationId: number }[]) =>
  [...entries].sort((a, b) => a.stationId - b.stationId);

test('descendre à une correspondance coche « descendu » sur tous ses quais, « passé » seulement sur la ligne prise', () => {
  const result = applyToggle([], platforms, { stationId: 1, passed: true, stopped: true });

  assert.deepEqual(sorted(result), [
    { stationId: 1, passed: true, stopped: true },
    { stationId: 3, passed: false, stopped: true },
  ]);
});

test('« passé » seul ne se propage pas aux autres lignes', () => {
  const result = applyToggle([], platforms, { stationId: 1, passed: true, stopped: false });

  assert.deepEqual(result, [{ stationId: 1, passed: true, stopped: false }]);
});

test('décocher « descendu » le retire partout, en gardant le « passé » des autres quais', () => {
  const before = [
    { stationId: 1, passed: true, stopped: true },
    { stationId: 3, passed: true, stopped: true },
  ];
  const result = applyToggle(before, platforms, { stationId: 1, passed: false, stopped: false });

  // Le quai décoché disparaît ; l'autre reste « passé » mais n'est plus « descendu ».
  assert.deepEqual(result, [{ stationId: 3, passed: true, stopped: false }]);
});

test('une station simple ne touche à aucune autre', () => {
  const before = [{ stationId: 4, passed: true, stopped: true }];
  const result = applyToggle(before, platforms, { stationId: 2, passed: true, stopped: true });

  assert.deepEqual(sorted(result), [
    { stationId: 2, passed: true, stopped: true },
    { stationId: 4, passed: true, stopped: true },
  ]);
});

test('sans index des quais, seule la station cochée change (repli sûr)', () => {
  const result = applyToggle([], [], { stationId: 1, passed: true, stopped: true });

  assert.deepEqual(result, [{ stationId: 1, passed: true, stopped: true }]);
});

const serverStats = {
  stations: { total: 0, visited: 0, passed: 0 },
  percent: 0,
  resumeLineId: 4,
  challenges: [{ key: 'week', title: 'x', current: 1, target: 3, lineId: null }],
  lines: [
    {
      id: 1,
      number: '1',
      name: 'L1',
      color: '#000',
      textColor: null,
      total: 0,
      visited: 0,
      passed: 0,
      percent: 0,
    },
    {
      id: 4,
      number: '4',
      name: 'L4',
      color: '#000',
      textColor: null,
      total: 0,
      visited: 0,
      passed: 0,
      percent: 0,
    },
  ],
};

test('compteurs : par ligne on compte les quais, au global les stations physiques', () => {
  // Descendu à Châtelet par la ligne 1 (donc coché aussi sur la 4) + passé à Louvre.
  const entries = applyToggle(
    applyToggle([], platforms, { stationId: 1, passed: true, stopped: true }),
    platforms,
    { stationId: 2, passed: true, stopped: false },
  );
  const stats = deriveStats(serverStats, platforms, entries);

  assert.deepEqual(
    stats.lines.map((l) => [l.number, l.visited, l.passed, l.total, l.percent]),
    [
      ['1', 1, 2, 2, 50],
      ['4', 1, 0, 2, 50],
    ],
  );
  // Châtelet ne compte qu'une fois au global : 1 station visitée sur 3 (Châtelet, Louvre, Cité).
  assert.deepEqual(stats.stations, { total: 3, visited: 1, passed: 2 });
  assert.equal(stats.percent, 33);
  // Ce qui vient du serveur est conservé.
  assert.equal(stats.resumeLineId, 4);
  assert.equal(stats.challenges.length, 1);
});

test('compteurs : sans index des quais, on garde ceux du serveur', () => {
  assert.equal(deriveStats(serverStats, [], []), serverStats);
});

// ---- État des écrans hors ligne --------------------------------------------------------------
const { withOfflineState, isNetworkError } = await import('@/shared/lib');
const base = {
  data: undefined,
  error: null,
  status: 'pending',
  fetchStatus: 'fetching',
  isPending: true,
  isError: false,
};

test('écran jamais chargé + pas de réseau : erreur « pas de connexion », pas un chargement sans fin', () => {
  const state = withOfflineState({ ...base, fetchStatus: 'paused' } as never);

  assert.equal(state.isPending, false);
  assert.equal(state.isError, true);
  assert.equal(isNetworkError(state.error), true);
});

test('données en mémoire + rafraîchissement en échec : on continue d’afficher les données', () => {
  const state = withOfflineState({
    ...base,
    data: ['ligne 1'],
    status: 'error',
    isPending: false,
    isError: true,
    error: new Error('réseau instable'),
    fetchStatus: 'idle',
  } as never);

  assert.equal(state.isError, false);
  assert.equal(state.isPending, false);
  assert.deepEqual(state.data, ['ligne 1']);
});

test('premier chargement avec du réseau : toujours un chargement', () => {
  const state = withOfflineState(base as never);

  assert.equal(state.isPending, true);
  assert.equal(state.isError, false);
});
