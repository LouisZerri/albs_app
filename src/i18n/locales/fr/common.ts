/** Textes transverses : onglets, composants partagés, erreurs réseau. */
export const common = {
  tabs: { network: 'Réseau', bonplans: 'Bons plans', discover: 'Découvrir', profile: 'Profil' },
  actions: { retry: 'Réessayer', back: 'Retour', cancel: 'Annuler' },
  a11y: {
    back: 'Retour',
    clearSearch: 'Effacer la recherche',
    loading: 'Chargement',
    darkMode: 'Mode sombre',
    language: 'Langue',
    collapseList: 'Réduire la liste',
    expandList: 'Agrandir la liste',
  },
  soon: 'Bientôt disponible',
  offline: {
    title: 'Pas de connexion',
    hint: 'Réessaie dès que tu retrouves du réseau, en station par exemple.',
    kept: 'Hors ligne · tes changements sont gardés',
    waitingOne: 'Hors ligne · 1 changement en attente',
    waitingMany: 'Hors ligne · {{count}} changements en attente',
    sendingOne: 'Envoi de 1 changement…',
    sendingMany: 'Envoi de {{count}} changements…',
  },
  errors: {
    network: 'Pas de connexion. Vérifie ton réseau et réessaie.',
    offline: 'Pas de connexion.',
    generic: 'Une erreur est survenue. Réessaie plus tard.',
  },
};
