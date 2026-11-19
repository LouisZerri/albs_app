/** Règle des pseudos : la même que l'API (`UsernamePolicy`) et que l'inscription du site. */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { usernameProblem } = await import('@/features/auth/lib/usernameRules');

test('un pseudo simple est accepté', () => {
  for (const name of ['abc', 'Louis_75', 'metro-fan', 'a'.repeat(20)]) {
    assert.equal(usernameProblem(name), null, name);
  }
});

test('trop court ou trop long', () => {
  assert.equal(usernameProblem('ab'), 'length');
  assert.equal(usernameProblem('a'.repeat(21)), 'length');
});

test('espaces, accents et balises sont refusés', () => {
  for (const name of ['jean dupont', 'élodie', '<b>x</b>', 'a.b.c', 'nom@site']) {
    assert.equal(usernameProblem(name), 'characters', name);
  }
});
