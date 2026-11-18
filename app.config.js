// Reprend `app.json` tel quel. Seule différence, pour les essais dans un navigateur
// (`npm run web:test`) : l'app est rendue entièrement dans la page, sans pré-rendu côté serveur
// (les modules du téléphone n'y existent pas).
module.exports = ({ config }) =>
  process.env.ALBS_WEB_TEST ? { ...config, web: { ...config.web, output: 'single' } } : config;
