# Paintball Sousse

Site vitrine et parcours de réservation pour **Paintball Sousse** (Sousse, Tunisie) : présentation des activités, galerie, carte, multilingue (FR / EN / AR) et flux de réservation multi-étapes.

Stack : **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **next-pwa**, **Zustand**, **React Hook Form** + **Zod**, **Leaflet** / **react-leaflet**, **Three.js** (R3F) pour certains effets visuels.

## Prérequis

- **Node.js** 20 (voir `.nvmrc` ; 18+ reste compatible)
- **npm** (ou équivalent)

## Installation

```bash
npm install
```

## Scripts

| Commande    | Description                          |
| ----------- | ------------------------------------ |
| `npm run dev`   | Serveur de développement (port **3000** par défaut) |
| `npm run build` | Build de production                  |
| `npm run start` | Lance l’app après un build           |
| `npm run lint`  | ESLint (config Next.js)              |

## PWA (next-pwa)

Le service worker et le precache **ne sont pas actifs en développement** (`NODE_ENV === 'development'`). Pour tester le comportement PWA, exécuter un build puis `npm run start`.

Les fichiers générés (ex. `public/sw.js`) peuvent être régénérés au build ; ne pas les éditer à la main.

## Contenu et médias

- **Logo** : fichier principal `components/media/logo.webp`, importé dans la barre de navigation et la barre de réservation. Une copie `public/logo.webp` est utilisée par le manifeste PWA (`public/manifest.json`) — à resynchroniser si le logo change.
- **Galerie** : images servies depuis `public/gallery/photo-{n}.webp`. La liste des photos et le format portrait / paysage sont définis dans `data/gallery.ts`. Tu peux garder une copie source dans le dossier `gallery/` à la racine puis copier vers `public/gallery/` pour le déploiement.

## Structure utile (aperçu)

```
app/              # Routes App Router (accueil, réservation, layout, styles globaux)
components/       # UI (sections, navbar, réservation, etc.)
data/             # Données statiques (ex. galerie)
lib/              # i18n, constantes (contact, carte), utilitaires
store/            # État réservation (Zustand)
public/           # Assets statiques, manifeste, logo PWA, galerie
```

Les textes traduits se trouvent notamment dans `lib/i18n-messages.ts`.

## Métadonnées et déploiement

L’URL de base des métadonnées est définie dans `app/layout.tsx` (`metadataBase`). À adapter sur le domaine de production (ex. `https://paintballsousse.tn`) pour les liens Open Graph absolus.

### Netlify

Fichiers à la racine : `netlify.toml` (build `npm run build`, dossier de publication `.next`, plugin `@netlify/plugin-nextjs` installé par Netlify au build). Pas de redirection SPA `/* → /index.html` : elle est réservée aux sites statiques mono-fichier et **casse** le runtime Next.js.

## Licence

Projet privé (`"private": true` dans `package.json`). Tous droits réservés sauf mention contraire du propriétaire du dépôt.
