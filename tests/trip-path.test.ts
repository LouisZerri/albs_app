/** Trajet en un geste : quelles stations sont parcourues, et ce qui est coché. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { tripPath, tripChanges, tripUndo } = await import('@/features/network/lib/tripPath');

type Stop = { id: number; position: number; branch: string | null; name: string };
let nextId = 1;
const line = (rows: [position: number, name: string, branch?: string][]): Stop[] =>
  rows.map(([position, name, branch]) => ({ id: nextId++, position, name, branch: branch ?? null }));
const names = (path: Stop[] | null) => path?.map((s) => s.name) ?? null;
const go = (stops: Stop[], from: string, to: string) => {
  const id = (name: string) => stops.find((s) => s.name === name)!.id;
  return names(tripPath(stops, id(from), id(to)));
};

// Fourche APRÈS le tronc (forme de la ligne 7).
const line7 = line([
  [27, 'Place d’Italie'], [28, 'Tolbiac'], [29, 'Maison Blanche', 'fork'],
  [30, 'Le Kremlin-Bicêtre', 'villejuif'], [30, 'Porte d’Italie', 'ivry'],
  [31, 'Villejuif - Léo Lagrange', 'villejuif'], [31, 'Porte de Choisy', 'ivry'],
]);
// Fourche AVANT le tronc (forme de la ligne 13).
const line13 = line([
  [1, 'Saint-Denis', 'saint-denis'], [1, 'Les Courtilles', 'asnieres'],
  [2, 'Basilique', 'saint-denis'], [2, 'Les Agnettes', 'asnieres'],
  [8, 'Guy Môquet', 'saint-denis'], [6, 'Brochant', 'asnieres'],
  [9, 'La Fourche', 'fork'], [10, 'Place de Clichy'], [11, 'Liège'],
]);
// Boucle à sens unique (forme de la ligne 10).
const line10 = line([
  [1, 'Boulogne - Pont de Saint-Cloud'], [2, 'Boulogne - Jean Jaurès'],
  [3, 'Michel-Ange - Molitor', 'direction'], [4, 'Chardon-Lagache', 'direction'], [5, 'Mirabeau', 'direction'],
  [6, 'Porte d’Auteuil', 'retour'], [7, 'Michel-Ange - Auteuil', 'retour'], [8, 'Église d’Auteuil', 'retour'],
  [9, 'Javel'], [10, 'Charles Michels'],
]);
// Boucle de la 7bis : une station à l'aller, une au retour.
const line7bis = line([
  [5, 'Botzaris'], [6, 'Place des Fêtes', 'direction'], [7, 'Danube', 'retour'], [8, 'Pré-Saint-Gervais'],
]);

test('tronc : toutes les stations entre le départ et l’arrivée, dans le sens du trajet', () => {
  assert.deepEqual(go(line7, 'Place d’Italie', 'Maison Blanche'), ['Place d’Italie', 'Tolbiac', 'Maison Blanche']);
  assert.deepEqual(go(line7, 'Maison Blanche', 'Place d’Italie'), ['Maison Blanche', 'Tolbiac', 'Place d’Italie']);
});

test('fourche : du tronc vers une branche, sans passer par l’autre', () => {
  assert.deepEqual(go(line7, 'Tolbiac', 'Porte de Choisy'), ['Tolbiac', 'Maison Blanche', 'Porte d’Italie', 'Porte de Choisy']);
  assert.deepEqual(go(line13, 'Les Courtilles', 'Liège'), ['Les Courtilles', 'Les Agnettes', 'Brochant', 'La Fourche', 'Place de Clichy', 'Liège']);
});

test('fourche : d’une branche à l’autre, en passant par la station-fourche', () => {
  assert.deepEqual(go(line7, 'Villejuif - Léo Lagrange', 'Porte de Choisy'), [
    'Villejuif - Léo Lagrange', 'Le Kremlin-Bicêtre', 'Maison Blanche', 'Porte d’Italie', 'Porte de Choisy',
  ]);
  assert.deepEqual(go(line13, 'Basilique', 'Les Agnettes'), ['Basilique', 'Guy Môquet', 'La Fourche', 'Brochant', 'Les Agnettes']);
});

test('boucle : seules les stations du sens parcouru sont traversées', () => {
  assert.deepEqual(go(line10, 'Boulogne - Jean Jaurès', 'Javel'), [
    'Boulogne - Jean Jaurès', 'Michel-Ange - Molitor', 'Chardon-Lagache', 'Mirabeau', 'Javel',
  ]);
  assert.deepEqual(go(line10, 'Charles Michels', 'Boulogne - Pont de Saint-Cloud'), [
    'Charles Michels', 'Javel', 'Église d’Auteuil', 'Michel-Ange - Auteuil', 'Porte d’Auteuil',
    'Boulogne - Jean Jaurès', 'Boulogne - Pont de Saint-Cloud',
  ]);
  assert.deepEqual(go(line7bis, 'Botzaris', 'Pré-Saint-Gervais'), ['Botzaris', 'Place des Fêtes', 'Pré-Saint-Gervais']);
  assert.deepEqual(go(line7bis, 'Pré-Saint-Gervais', 'Botzaris'), ['Pré-Saint-Gervais', 'Danube', 'Botzaris']);
});

test('boucle : on ne remonte pas un sens unique, le trajet fait le tour', () => {
  assert.deepEqual(go(line10, 'Mirabeau', 'Chardon-Lagache'), [
    'Mirabeau', 'Javel', 'Église d’Auteuil', 'Michel-Ange - Auteuil', 'Porte d’Auteuil',
    'Boulogne - Jean Jaurès', 'Michel-Ange - Molitor', 'Chardon-Lagache',
  ]);
});

test('trajet impossible : même station ou station inconnue', () => {
  assert.equal(go(line7, 'Tolbiac', 'Tolbiac'), null);
  assert.equal(tripPath(line7, line7[0].id, 99999), null);
});

test('cochage : descendu aux deux bouts, passé entre, jamais de retour en arrière', () => {
  const path = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  const entry = (stationId: number, passed: boolean, stopped: boolean) => ({
    stationId, passed, stopped, firstPassedAt: null, firstStoppedAt: null,
  });
  // 2 déjà passée, 3 déjà descendue, 5 (arrivée) seulement passée.
  const before = [entry(2, true, false), entry(3, true, true), entry(5, true, false)];

  const changes = tripChanges(path, before);
  assert.deepEqual(changes, [
    { stationId: 1, passed: true, stopped: true },
    { stationId: 4, passed: true, stopped: false },
    { stationId: 5, passed: true, stopped: true },
  ]);

  // Annuler remet exactement l'état d'avant, pour les seules stations modifiées.
  assert.deepEqual(tripUndo(changes, before), [
    { stationId: 1, passed: false, stopped: false },
    { stationId: 4, passed: false, stopped: false },
    { stationId: 5, passed: true, stopped: false },
  ]);
});
