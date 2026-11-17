const { colors, radius } = require('./src/shared/theme/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors, // source unique : src/shared/theme/tokens.js
      borderRadius: {
        card: `${radius.card}px`,
        pill: `${radius.pill}px`,
      },
    },
  },
  plugins: [],
};
