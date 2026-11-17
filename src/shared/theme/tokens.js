// Source unique des tokens de design.
// Consommée par `tailwind.config.js` (NativeWind) ET par `theme/index.ts` (accès JS typé).
// (Fichier .js volontairement, pour être `require()`-able par la config Tailwind.)

/** Thème clair : fond gris-bleu froid, encre sombre, accent violet. */
const light = {
  bg: '#F4F6F8', // fond de l'app
  surface: '#FFFFFF', // cartes
  ink: '#14161C', // texte principal
  muted: '#646D7D', // texte secondaire (contraste ≥ 4,5 sur le fond et sur les cartes)
  hair: '#E6E9EF', // séparateurs / rails inactifs
  accent: '#7C3AED', // violet (action)
  accentSoft: '#DDD6FE', // violet clair (boutons secondaires / fonds tonals)
  visited: '#16A34A', // station descendue (vert)
  visitedSoft: '#F1FBF5', // fond d'un élément terminé (ligne à 100 %)
  passed: '#EAB308', // station passée (ambre)
  goldSoft: '#FFFBEB', // fond d'un badge acquis
  todo: '#C2C9D4', // station à faire (point sur la carte, tracé estompé)
  danger: '#DC2626', // erreurs / états invalides (rouge)
  mapLand: '#E9EDF2', // carte hors ligne : sol autour de Paris
  mapCity: '#F8F9FB', // carte hors ligne : Paris
  mapWater: '#A9CDEE', // carte hors ligne : Seine et Marne
  white: '#FFFFFF', // blanc fixe (texte sur fond coloré : lignes, dégradés)
};

/** Thème sombre : mêmes rôles, valeurs recalées pour garder les contrastes. */
const dark = {
  bg: '#0F1115',
  surface: '#1B1E26',
  ink: '#F2F4F7',
  muted: '#A0A8B6',
  hair: '#2C313C',
  accent: '#9171F8', // violet éclairci : lisible en texte sur fond sombre
  accentSoft: '#221C40',
  visited: '#22C55E',
  visitedSoft: '#12251A',
  passed: '#FACC15',
  goldSoft: '#2A2310',
  todo: '#5A6272',
  danger: '#F87171',
  mapLand: '#12151A',
  mapCity: '#1C2028',
  mapWater: '#2B4A6B',
  white: '#FFFFFF',
};

const palettes = { light, dark };

const radius = { sm: 8, md: 12, card: 20, pill: 999 };

/** '#F4F6F8' → '244 246 248' (canaux RVB, format attendu par les variables CSS de Tailwind). */
function rgbChannels(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
}

/** Variables CSS d'une palette : { '--color-bg': '244 246 248', … }. */
function cssVariables(palette) {
  return Object.fromEntries(
    Object.entries(palette).map(([name, hex]) => [`--color-${name}`, rgbChannels(hex)]),
  );
}

module.exports = { palettes, radius, cssVariables };
