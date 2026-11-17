import 'i18next';

import type { fr } from './locales/fr';

// Clés de traduction vérifiées à la compilation : une clé inconnue est une erreur de type.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof fr;
  }
}
