// Permet d'exécuter le VRAI code de l'app (fichiers .ts sans JSX) dans Node, sans simulateur :
// résout l'alias `@/`, les imports sans extension, et remplace les modules natifs par des bouchons.
import { register } from 'node:module';

register('./loader.mjs', import.meta.url);
