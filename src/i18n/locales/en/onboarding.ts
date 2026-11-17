import type { onboarding as fr } from '../fr/onboarding';

export const onboarding: typeof fr = {
  steps: {
    welcome: {
      title: 'Welcome aboard',
      body: 'À la bonne station turns your journeys into an adventure: tick off the stations where you got off, earn badges and set out to conquer the whole network.',
    },
    principle: {
      title: 'How it works',
      body: 'Every station counts. Track your progress line by line, unlock badges and aim for 100% of the Paris network.',
    },
    fairPlay: {
      title: 'Fair play',
      body: 'Everything here relies on honesty: no geolocation, no cheating. You only tick off stations you have really been to, and you respect the other players and the spirit of the game.',
    },
  },
  continue: 'Continue',
  commit: 'I’m in',
  error: 'Could not confirm. Try again.',
  celebration: {
    title: 'Welcome aboard!',
    body: 'You’ve just unlocked your first badge. The network is waiting for you 🚇',
    enter: 'Enter the app',
  },
};
