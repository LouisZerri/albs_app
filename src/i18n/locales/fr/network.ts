/** Textes de la fonctionnalité « network » : liste des lignes, rail, carte, recherche, progression. */
export const network = {
  /** Bascule Liste | Carte de l'onglet Réseau. */
  toggle: { list: 'Liste', map: 'Carte' },
  /** Partagés par plusieurs écrans. */
  lineName: 'Ligne {{number}}',
  stationsVisited: '{{visited}} / {{total}} stations visitées',
  searchPlaceholder: 'Rechercher une station…',
  /** Les trois états d'une station. */
  states: { todo: 'À faire', passed: 'Passé', visited: 'Descendu' },
  list: {
    loadError: 'Impossible de charger le réseau.',
    stationsCount: '{{visited}}/{{total}} stations',
  },
  progress: {
    title: 'Ta progression',
    resume: 'Continuer la ligne {{number}}',
    resumeLeft: ' · plus que {{count}}',
    resumeA11yOne: 'Continuer la ligne {{number}}, plus que {{count}} station',
    resumeA11yMany: 'Continuer la ligne {{number}}, plus que {{count}} stations',
  },
  challenges: {
    title: 'Défis',
    a11y: '{{title}} : {{current}} sur {{target}}',
  },
  search: {
    resultA11y: '{{name}}, ligne {{number}}',
    unavailable: 'Recherche indisponible pour le moment.',
    empty: 'Aucune station ne correspond à ta recherche.',
  },
  rail: {
    loadError: 'Impossible de charger la ligne.',
    hint: 'Touche une station : passé → descendu → à faire 👆',
    lineCompleted: 'Ligne terminée',
    forkHint: 'La ligne se sépare — choisis ta branche',
    oneWay: 'sens unique',
    loopFallback: 'Boucle',
  },
  trip: {
    add: 'Trajet',
    addA11y: 'Ajouter un trajet',
    pickStart: 'Touche ta station de départ.',
    pickEnd: 'Départ : {{from}}. Touche ta station d’arrivée.',
    summary: '{{from}} → {{to}} · {{count}} stations',
    confirm: 'Valider',
    added: 'Trajet ajouté.',
    undo: 'Annuler le trajet',
    impossible: 'Ce trajet n’est pas possible sur cette ligne.',
    nothingNew: 'Ce trajet était déjà coché.',
  },
  map: {
    loadError: 'Impossible de charger la carte.',
    percent: '{{percent}}% du réseau',
    remaining: 'Ce qu’il me reste',
    lineA11yOne: 'Ligne {{number}}, {{visited}} station sur {{total}}',
    lineA11yMany: 'Ligne {{number}}, {{visited}} stations sur {{total}}',
  },
  bonplans: {
    aroundOne: '{{count}} bon plan autour',
    aroundMany: '{{count}} bons plans autour',
  },
};
