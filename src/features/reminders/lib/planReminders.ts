/** Ce dont le calcul a besoin : un défi (forme de l'API) et le numéro des lignes. */
type ChallengeLike = { key: string; current: number; target: number; lineId: number | null };
type LineLike = { id: number; number: string };

/** Un rappel à programmer sur le téléphone. */
export type Reminder =
  | { kind: 'week'; at: Date; remaining: number }
  | { kind: 'line'; at: Date; remaining: number; lineId: number; lineNumber: string };

const REMINDER_HOUR = 18;
/** Délai sans ouvrir l'app avant le rappel « ligne presque finie ». */
const LINE_REMINDER_DAYS = 3;
const FRIDAY = 5;
const SUNDAY = 0;

/** Le prochain `weekday` (0 = dimanche) à `hour` h, aujourd'hui compris ; peut être déjà passé. */
function thisWeek(now: Date, weekday: number, hour: number): Date {
  const date = new Date(now);
  // Semaine du lundi au dimanche, comme le défi : dimanche est le DERNIER jour.
  const today = (now.getDay() + 6) % 7;
  const target = (weekday + 6) % 7;
  date.setDate(now.getDate() + (target - today));
  date.setHours(hour, 0, 0, 0);
  return date;
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/**
 * Les rappels à programmer d'après les défis en cours. Fonction pure : tout est recalculé (et
 * reprogrammé) à chaque ouverture de l'app, donc quelqu'un d'actif n'est jamais dérangé.
 *
 * - **Défi de la semaine** pas encore réussi → vendredi 18 h ; si c'est passé, dimanche 10 h
 *   (dernière chance) ; si c'est passé aussi, rien cette semaine.
 * - **Ligne presque finie** → dans 3 jours à 18 h. Repoussé à chaque ouverture de l'app : il ne
 *   sonne que si l'on n'est pas revenu entre-temps.
 * - Jamais deux rappels le même jour.
 */
export function planReminders(
  challenges: readonly ChallengeLike[],
  lines: readonly LineLike[],
  now: Date,
): Reminder[] {
  const reminders: Reminder[] = [];

  const week = challenges.find((c) => c.key === 'week');
  if (week && week.current < week.target) {
    const at = [thisWeek(now, FRIDAY, REMINDER_HOUR), thisWeek(now, SUNDAY, 10)].find(
      (date) => date > now,
    );
    if (at) reminders.push({ kind: 'week', at, remaining: week.target - week.current });
  }

  const line = challenges.find((c) => c.key === 'line' && c.lineId !== null);
  const lineNumber = lines.find((l) => l.id === line?.lineId)?.number;
  if (line && line.lineId !== null && lineNumber !== undefined && line.current < line.target) {
    const at = new Date(now);
    at.setDate(now.getDate() + LINE_REMINDER_DAYS);
    at.setHours(REMINDER_HOUR, 0, 0, 0);
    if (reminders.some((r) => sameDay(r.at, at))) at.setDate(at.getDate() + 1);
    reminders.push({
      kind: 'line',
      at,
      remaining: line.target - line.current,
      lineId: line.lineId,
      lineNumber,
    });
  }

  return reminders;
}
