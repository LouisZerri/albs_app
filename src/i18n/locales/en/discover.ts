import type { discover as fr } from '../fr/discover';

export const discover: typeof fr = {
  home: {
    title: 'Discover',
    subtitle: 'Your challenges, trail ideas and the secrets of the network.',
    loadError: 'Couldn’t load the trails.',
    journeysLabel: 'Trails',
    ghostsLabel: 'Ghost stations · {{unlocked}}/{{total}}',
    ghostsIntro:
      'Closed or never opened, you ride through them without seeing them. Get off at the stations on either side to discover their story.',
  },
  ghost: {
    unlockHint: 'To unlock it, get off at {{stations}}.',
    unlockJoin: 'and',
    missing: 'You still need {{stations}}.',
    missingJoin: 'and',
  },
  journey: {
    fallbackTitle: 'Trail',
    progress: '{{visited}}/{{total}} stations visited',
    loadError: 'Couldn’t load this trail.',
    stopVisitedA11y: '{{name}}, visited',
    stopToVisitA11y: '{{name}}, not visited yet',
    footer: 'Tick stations off from the Network tab: the trail updates by itself.',
  },
};
