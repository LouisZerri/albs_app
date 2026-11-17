// Source unique des tokens de design.
// Consommée par `tailwind.config.js` (NativeWind) ET par `theme/index.ts` (accès JS typé).
// (Fichier .js volontairement, pour être `require()`-able par la config Tailwind.)

const colors = {
  bg: '#F4F6F8', // fond gris-bleu froid
  surface: '#FFFFFF', // cartes
  ink: '#14161C', // texte principal
  muted: '#646D7D', // texte secondaire (contraste ≥ 4,5 sur le fond et sur les cartes)
  hair: '#E6E9EF', // séparateurs / rails inactifs
  accent: '#7C3AED', // violet (action)
  accentSoft: '#DDD6FE', // violet clair (boutons secondaires / fonds tonals)
  visited: '#16A34A', // station descendue (vert)
  passed: '#EAB308', // station passée (ambre)
  danger: '#DC2626', // erreurs / états invalides (rouge)
  white: '#FFFFFF',
};

const radius = { sm: 8, md: 12, card: 20, pill: 999 };

module.exports = { colors, radius };
