// Flat config ESLint (SDK 54). Base Expo + désactivation des règles de format (Prettier gère).
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...expoConfig,
  prettier,
  {
    ignores: ['dist/*', '.expo/*', 'assets/*', 'node_modules/*', 'src/content/*'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Conventions maison (cf. ARCHITECTURE.md)
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
