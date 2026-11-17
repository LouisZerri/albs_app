/** Textes de la fonctionnalité « discover ». */
export const discover = {
  home: {
    title: 'Découvrir',
    subtitle: 'Tes défis, des idées de parcours et les secrets du réseau.',
    loadError: 'Impossible de charger les parcours.',
    journeysLabel: 'Parcours',
    ghostsLabel: 'Stations fantômes · {{unlocked}}/{{total}}',
    ghostsIntro:
      'Fermées ou jamais ouvertes, on les traverse sans les voir. Descends aux stations qui les encadrent pour découvrir leur histoire.',
  },
  ghost: {
    unlockHint: 'Pour la débloquer, descends à {{stations}}.',
    // Liaison entre les stations à visiter : « Arsenal et à Bastille ».
    unlockJoin: 'et à',
    missing: 'Il te manque {{stations}}.',
    missingJoin: 'et',
  },
  journey: {
    fallbackTitle: 'Parcours',
    progress: '{{visited}}/{{total}} stations visitées',
    loadError: 'Impossible de charger ce parcours.',
    stopVisitedA11y: '{{name}}, visitée',
    stopToVisitA11y: '{{name}}, à visiter',
    footer: 'Coche les stations depuis le Réseau : le parcours se met à jour tout seul.',
  },
};
