/**
 * Règle des pseudos, miroir de `UsernamePolicy` côté API (et de l'inscription du site) :
 * 3 à 20 caractères, lettres sans accent, chiffres, tirets et tirets bas.
 * Les pseudos réservés (« admin »…) sont refusés par le serveur, qui renvoie son message.
 */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;

export type UsernameProblem = 'length' | 'characters';

/** Ce qui cloche dans un pseudo, ou `null` s'il est acceptable. */
export function usernameProblem(username: string): UsernameProblem | null {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) return 'length';
  return /^[a-zA-Z0-9_-]+$/.test(username) ? null : 'characters';
}
