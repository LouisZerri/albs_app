const plugin = require('tailwindcss/plugin');

const { palettes, radius, cssVariables } = require('./src/shared/theme/tokens');

// Chaque couleur du thème est une variable CSS : la même classe (`bg-surface`, `text-ink`…)
// donne la bonne teinte en clair comme en sombre. `<alpha-value>` garde `bg-hair/40` & co.
const themeColors = Object.fromEntries(
  Object.keys(palettes.light).map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // Thème piloté par l'app (interrupteur du profil), pas seulement par le système.
  darkMode: 'class',
  theme: {
    extend: {
      colors: themeColors, // source unique : src/shared/theme/tokens.js
      borderRadius: {
        card: `${radius.card}px`,
        pill: `${radius.pill}px`,
      },
    },
  },
  plugins: [
    // Injecte les deux palettes de tokens.js sous forme de variables CSS.
    plugin(({ addBase }) => {
      addBase({
        ':root': cssVariables(palettes.light),
        '.dark:root': cssVariables(palettes.dark),
      });
    }),
  ],
};
