/** Traductions : les deux langues répondent, et un message d'erreur suit la langue active. */
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

const { i18n, deviceLanguage } = await import('@/i18n/instance');
const { withOfflineState } = await import('@/shared/lib');

afterEach(() => i18n.changeLanguage('fr'));

test('langue du téléphone reprise quand l’app la parle (bouchon : français)', () => {
  assert.equal(deviceLanguage(), 'fr');
  assert.equal(i18n.t('tabs.network'), 'Réseau');
});

test('changement de langue : les textes et les nombres suivent', async () => {
  await i18n.changeLanguage('en');
  assert.equal(i18n.t('tabs.network'), 'Network');
  assert.equal(i18n.t('offline.waitingMany', { count: 3 }), 'Offline · 3 changes waiting');
});

test('erreur « pas de connexion » : dans la langue active au moment où elle survient', async () => {
  const paused = { data: undefined, fetchStatus: 'paused', status: 'pending' } as never;
  assert.equal(withOfflineState(paused).error?.message, 'Pas de connexion.');

  await i18n.changeLanguage('en');
  assert.equal(withOfflineState(paused).error?.message, 'No connection.');
});
