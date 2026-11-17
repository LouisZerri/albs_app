import type { reminders as fr } from '../fr/reminders';

export const reminders: typeof fr = {
  settings: {
    title: 'Reminders',
    hint: 'A nudge when a challenge or a line is almost done.',
    enabled: 'Reminders on',
    denied: 'Allow notifications in your phone settings.',
  },
  week: {
    title: 'Weekly challenge',
    bodyOne: 'Just {{count}} station to discover before Sunday night.',
    bodyMany: 'Just {{count}} stations to discover before Sunday night.',
  },
  line: {
    title: 'Line {{number}} almost complete',
    bodyOne: 'Just {{count}} station to go.',
    bodyMany: 'Just {{count}} stations to go.',
  },
};
