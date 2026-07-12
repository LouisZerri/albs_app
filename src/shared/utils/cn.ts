/** Concatène des classes conditionnelles (les valeurs falsy sont ignorées). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
