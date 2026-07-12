/** Règles de robustesse du mot de passe, source unique (schéma Zod + affichage live). */
export const passwordRules = [
  { key: 'length', label: 'Au moins 8 caractères', test: (v: string) => v.length >= 8 },
  { key: 'upper', label: 'Une majuscule', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'Une minuscule', test: (v: string) => /[a-z]/.test(v) },
  { key: 'special', label: 'Un caractère spécial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export function isPasswordValid(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value));
}
