import type { common as fr } from '../fr/common';

export const common: typeof fr = {
  tabs: { network: 'Network', bonplans: 'Spots', discover: 'Discover', profile: 'Profile' },
  actions: { retry: 'Try again', back: 'Back', cancel: 'Cancel' },
  a11y: {
    back: 'Back',
    clearSearch: 'Clear search',
    loading: 'Loading',
    darkMode: 'Dark mode',
    language: 'Language',
    collapseList: 'Collapse list',
    expandList: 'Expand list',
  },
  soon: 'Coming soon',
  offline: {
    title: 'No connection',
    hint: 'Try again once you are back online, in a station for example.',
    kept: 'Offline · your changes are saved',
    waitingOne: 'Offline · 1 change waiting',
    waitingMany: 'Offline · {{count}} changes waiting',
    sendingOne: 'Sending 1 change…',
    sendingMany: 'Sending {{count}} changes…',
  },
  errors: {
    network: 'No connection. Check your network and try again.',
    offline: 'No connection.',
    generic: 'Something went wrong. Please try again later.',
  },
};
