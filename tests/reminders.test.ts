/** Rappels : quand programmer quoi, d'après les défis en cours. Fonction pure, sans téléphone. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { planReminders } = await import('@/features/reminders/lib/planReminders');

const lines = [{ id: 4, number: '4' }];
const week = (current: number) => ({ key: 'week', current, target: 3, lineId: null });
const line = (current: number) => ({ key: 'line', current, target: 27, lineId: 4 });
const at = (iso: string) => new Date(iso);
const stamp = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}h`;

// Repères : le 16/11/2026 est un lundi, le 20 un vendredi, le 22 un dimanche.
test('défi de la semaine en cours : rappel vendredi 18 h', () => {
  const [reminder] = planReminders([week(1)], lines, at('2026-11-17T09:00:00'));
  assert.equal(reminder.kind, 'week');
  assert.equal(stamp(reminder.at), '2026-11-20 18h');
  assert.equal(reminder.remaining, 2);
});

test('vendredi soir passé : dernière chance dimanche 10 h, puis plus rien', () => {
  const saturday = planReminders([week(1)], lines, at('2026-11-21T12:00:00'));
  assert.equal(stamp(saturday[0].at), '2026-11-22 10h');

  assert.deepEqual(planReminders([week(1)], lines, at('2026-11-22T15:00:00')), []);
});

test('un dimanche matin : le rappel est celui du jour, pas celui de la semaine suivante', () => {
  const [reminder] = planReminders([week(0)], lines, at('2026-11-22T08:00:00'));
  assert.equal(stamp(reminder.at), '2026-11-22 10h');
});

test('défi de la semaine réussi : aucun rappel', () => {
  assert.deepEqual(planReminders([week(3)], lines, at('2026-11-17T09:00:00')), []);
});

test('ligne presque finie : rappel dans 3 jours à 18 h, avec la ligne à ouvrir', () => {
  const [reminder] = planReminders([week(3), line(25)], lines, at('2026-11-16T09:00:00'));
  assert.deepEqual(
    { ...reminder, at: stamp(reminder.at) },
    { kind: 'line', at: '2026-11-19 18h', remaining: 2, lineId: 4, lineNumber: '4' },
  );
});

test('jamais deux rappels le même jour : celui de la ligne est décalé au lendemain', () => {
  // Mardi : le défi tombe vendredi 20, la ligne (mardi + 3 jours) aussi → samedi 21.
  const reminders = planReminders([week(1), line(25)], lines, at('2026-11-17T09:00:00'));
  assert.deepEqual(
    reminders.map((r) => `${r.kind} ${stamp(r.at)}`),
    ['week 2026-11-20 18h', 'line 2026-11-21 18h'],
  );
});

test('ligne inconnue ou défi sans ligne : pas de rappel de ligne', () => {
  assert.deepEqual(planReminders([line(25)], [], at('2026-11-16T09:00:00')), []);
});
