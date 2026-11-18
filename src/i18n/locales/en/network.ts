import type { network as fr } from '../fr/network';

export const network: typeof fr = {
  toggle: { list: 'List', map: 'Map' },
  lineName: 'Line {{number}}',
  stationsVisited: '{{visited}} / {{total}} stations visited',
  searchPlaceholder: 'Search for a station…',
  states: { todo: 'To do', passed: 'Passed through', visited: 'Got off' },
  list: {
    loadError: 'Couldn’t load the network.',
    stationsCount: '{{visited}}/{{total}} stations',
  },
  progress: {
    title: 'Your progress',
    resume: 'Continue line {{number}}',
    resumeLeft: ' · {{count}} to go',
    resumeA11yOne: 'Continue line {{number}}, {{count}} station to go',
    resumeA11yMany: 'Continue line {{number}}, {{count}} stations to go',
  },
  challenges: {
    title: 'Challenges',
    a11y: '{{title}}: {{current}} of {{target}}',
  },
  search: {
    resultA11y: '{{name}}, line {{number}}',
    unavailable: 'Search isn’t available right now.',
    empty: 'No station matches your search.',
  },
  rail: {
    loadError: 'Couldn’t load the line.',
    hint: 'Tap a station: passed through → got off → to do 👆',
    lineCompleted: 'Line complete',
    forkHint: 'The line splits — pick your branch',
    oneWay: 'one-way',
    loopFallback: 'Loop',
  },
  trip: {
    add: 'Trip',
    addA11y: 'Add a trip',
    pickStart: 'Tap your departure station.',
    pickEnd: 'From {{from}}. Tap your arrival station.',
    summary: '{{from}} → {{to}} · {{count}} stations',
    confirm: 'Confirm',
    added: 'Trip added.',
    undo: 'Undo trip',
    impossible: 'This trip isn’t possible on this line.',
    nothingNew: 'This trip was already ticked off.',
  },
  map: {
    loadError: 'Couldn’t load the map.',
    percent: '{{percent}}% of the network',
    remaining: 'What’s left',
    lineA11yOne: 'Line {{number}}, {{visited}} station out of {{total}}',
    lineA11yMany: 'Line {{number}}, {{visited}} stations out of {{total}}',
  },
  bonplans: {
    aroundOne: '{{count}} spot nearby',
    aroundMany: '{{count}} spots nearby',
  },
};
