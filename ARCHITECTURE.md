# Architecture & conventions — À la bonne station (mobile)

> **Non négociable.** Toute contribution (humaine ou IA) respecte ce document. En cas de doute, on découpe et on isole.

## 1. Structure feature-based (PAS de découpage par type technique global)

```
src/
  app/                      # routes Expo Router UNIQUEMENT (écrans fins qui assemblent)
  features/
    <feature>/              # ex: auth, reseau, bonplans, forum, profil, onboarding
      components/           # UI pure de la feature
      hooks/                # logique + orchestration (React Query)
      api/                  # accès réseau de la feature (via le client http partagé)
      types/                # schémas Zod + types dérivés
      store/                # état local de la feature si besoin
      screens/              # composition d'écran (branchée dans app/)
  shared/                   # RÉELLEMENT transverse
    ui/                     # ui-kit : Button, Input, Card, Text, Screen...
    lib/                    # client http, config, query client
    hooks/                  # hooks génériques
    utils/                  # helpers purs
    constants/              # constantes
    theme/                  # couleurs, spacing, typo (aucune valeur magique ailleurs)
    types/                  # types transverses
```

## 2. Séparation stricte des couches
- **UI** : composants **purs**, sans logique métier ni fetch. Reçoivent des props, émettent des events.
- **hooks** : la logique (orchestration, React Query, transformations). Les écrans branchent des hooks.
- **api / services** : accès réseau **isolé derrière un client** (`shared/lib/http`). Jamais d'URL/headers en dur ailleurs.
- **types** : **Zod** en premier (validation des réponses API) → types dérivés (`z.infer`).

**Règle d'or : aucun composant ne fait un fetch direct.** Toujours `composant → hook → api → client`.

## 3. Qualité de code
- **Fichiers ≤ ~150-200 lignes.** Au-delà → on découpe.
- **1 composant = 1 fichier = 1 responsabilité.** Plus d'une responsabilité → split.
- **Zéro logique métier dans les écrans** (`screens/` et `app/`) : ils assemblent des composants et branchent des hooks.
- **Nommage** : `PascalCase` (composants), `camelCase` (hooks/fonctions), `UPPER_CASE` (constantes).
- **Imports absolus** via `@/…` — **jamais** de `../../../`.
- **Typage strict**, zéro `any` non justifié (si vraiment nécessaire, commenter pourquoi).
- **États explicites** pour chaque écran de données : **loading / empty / error / success**.

## 4. Outillage
- **ESLint + Prettier** stricts (+ règle taille de fichier si possible).
- **Theme centralisé** (`shared/theme`) — couleurs/spacing/typo. NativeWind (Tailwind) branché sur ces tokens (`tailwind.config.js`). Aucune valeur magique en dur.
- **Variables d'env** via `expo-constants` / `.env` (ex: `API_BASE_URL`). **Jamais de secret en dur.**
- **README** à jour expliquant l'archi et les conventions.

## 5. Stack (rappel)
NativeWind (Tailwind, cohérent avec le web) · React Query (données serveur) · Zod (validation) · Expo Router (nav) · `expo-secure-store` (JWT + refresh) · client http centralisé (JWT + refresh auto + header `ngrok-skip-browser-warning` en dev).

## 6. Méthode
**On avance petit à petit, une tranche à la fois, testée sur le téléphone.** Pas de gros dump.
