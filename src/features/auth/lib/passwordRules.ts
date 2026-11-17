/**
 * Règles de robustesse du mot de passe, source unique (schéma Zod + affichage live).
 * Le libellé de chaque règle est traduit à l'affichage : `auth:passwordRules.<key>`.
 */
export const passwordRules = [
  { key: 'length', test: (v: string) => v.length >= 8 },
  { key: 'upper', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'lower', test: (v: string) => /[a-z]/.test(v) },
  { key: 'special', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export function isPasswordValid(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value));
}
