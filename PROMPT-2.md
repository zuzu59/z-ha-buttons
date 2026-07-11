# PROMPT-2 — recette exacte de z-ha-buttons

Ce document est la **source opératoire** pour recréer l’application à
partir du code produit, sans dépendre de `PROMPT.md`, `README.md` ou
`CHANGELOG.md`.

## 1) But du projet

Créer une PWA Vue 3 mobile-first pour piloter des boutons Home Assistant,
avec :
- stockage local Dexie,
- secrets chiffrés,
- synchronisation Home Assistant,
- navigation par vues,
- import / export CSV,
- menus Help / About / Tools,
- support GitHub Pages.

## 2) Stack technique

- Vue 3
- Vite
- vue-router
- Dexie
- vite-plugin-pwa
- Vitest
- Web Crypto API
- Home Assistant via WebSocket API (principalement)

## 3) Design / UX à reproduire

- thème sombre profond (`#0b1020` / `#11192d`)
- cartes arrondies, bordures fines, gradients bleus/violets
- topbar compacte avec : titre cliquable à gauche, verrouillage + hamburger à droite
- footer fin affichant version + état
- accueil en grille 2 colonnes sur desktop
- style mobile-first, touch-friendly
- boutons / cartes sans noms techniques d’entité à l’accueil
- menu hamburger hiérarchique avec sous-menu `Tools` déplié au survol
- page About et page Help refactorisées en cartes lisibles

## 4) Structure de l’application

### Routes
- `/` : accueil
- `/settings` : configuration Home Assistant
- `/buttons/new` : ajout d’un bouton
- `/buttons/:id/edit` : édition d’un bouton
- `/buttons/:id` : détail d’une lampe
- `/order` : ordre d’affichage
- `/sync` : export / import CSV
- `/help` : aide
- `/about` : informations / changelog

### Layout global
- `src/App.vue`
  - topbar
  - router view
  - footer
  - menu hamburger
  - modal de déverrouillage
- `src/main.js`
  - initialise le store avant le montage Vue

## 5) Modèle de données local

### Dexie
Base locale `z-ha-buttons` avec :
- `settings` : table clé/valeur (`&key`)
- `buttons` : `++id, order, entityId, kind, updatedAt`

### Configuration persistée
Clé `ha-config` contenant au minimum :
- `serverUrl`
- `homeAssistantName`
- `tokenSecret` (chiffré)
- `masterPassword` (stocké localement pour auto-déverrouillage)
- `lockMinutes`
- `updatedAt`

### Bouton persistant
Champs attendus :
- `id`
- `label`
- `entityId`
- `icon`
- `color`
- `kind` (`switch` ou `light`)
- `order`
- `createdAt`
- `updatedAt`
- `state`
- `attributes`
- `lastSyncedAt`

### Ordre d’affichage
- clé `button-order`
- stockage des `ids` dans l’ordre choisi

## 6) Sécurité

- dérivation PBKDF2 + SHA-256
- AES-GCM 256 bits
- salt 16 bytes
- IV 12 bytes
- chiffrement du token Home Assistant
- effacement mémoire des buffers sensibles quand possible
- auto-déverrouillage si le `masterPassword` local est disponible

## 7) Home Assistant

### Principe
- les actions passent par WebSocket API du navigateur
- REST est conservé comme helper, mais le flux principal est WebSocket
- cela évite les problèmes CORS

### Fonctions attendues
Dans `src/lib/homeAssistant.js` :
- `pingHomeAssistant(config)`
- `fetchHomeAssistantConfig(config)`
- `fetchStates(config)`
- `fetchEntityState(config, entityId)`
- `callEntityToggle(config, entityId, nextState?, data?)`
- `setLightValues(config, entityId, data)`

### Comportement de pilotage
- `toggle` / `light` ⇒ appel service Home Assistant
- après action, relire l’état confirmé **avec délai**
- délai initial post-écriture : **2 secondes**
- si l’état n’est pas confirmé, refaire une lecture avec **1 seconde** entre les tentatives
- nombre de retries après délai initial : **3**
- la même logique doit servir pour :
  - toggle d’un switch
  - réglage d’une lampe

### Rafraîchissement accueil
- au chargement de l’accueil, rafraîchir les états distants et mettre à jour la liste locale
- l’accueil doit rester cohérent après un retour de vue ou un toggle

## 8) Écrans à reproduire

### Accueil
- si aucune config : écran “Bienvenue” + lien Configurer
- si config : grille de cartes boutons
- affichage de : icône + label + état
- ne pas afficher le nom technique de l’entité
- tap = toggle
- appui long sur une lampe = ouvrir le détail

### Configuration
- URL serveur
- token Home Assistant
- mot de passe maître
- confirmation du mot de passe
- boutons œil pour afficher/masquer token et mot de passe
- bouton “Tester la connexion”
- bouton “Enregistrer”
- le formulaire restaure les valeurs existantes si déjà sauvegardées

### Ajout / édition de bouton
- libellé
- entité Home Assistant
- icône
- couleur
- type (`switch` / `light`)
- enregistrement puis redirection vers le détail
- si l’entité commence par `light.`, le kind doit devenir `light`

### Détail lampe
- bouton Modifier
- badge avec icône, entité, état
- slider intensité
- slider température couleur
- appliquer intensité
- appliquer température
- afficher l’historique local (créé / modifié)

### Ordre d’affichage
- réordonner avec boutons ↑ / ↓
- sauvegarde automatique, sans bouton enregistrer

### Export / import CSV
- exporter toute la base
- importer après confirmation
- l’import doit réinitialiser la base avant restauration
- gérer les erreurs CSV

### Help
- guide de démarrage
- étapes de configuration
- utilisation courante
- maintenance (refresh PWA, reset factory, About)

### About
- afficher : version locale, branche, liens GitHub, changelog
- lire le `CHANGELOG.md` brut sur GitHub
- comparer la version locale avec la dernière version du changelog
- afficher un message clair :
  - `Nouvelle version disponible : X`
  - ou `Tu es à jour`
- le bouton du bas ouvre le changelog GitHub

## 9) Menu hamburger

Ordre exact :
- Ajout d’un bouton
- Ordre d’affichage des boutons
- Tools
  - Configuration
  - Exportation / importation CSV
  - Force refresh PWA
  - Reset factory
- Help
- About

Règles :
- `Tools` doit rester compact et ne montrer ses entrées qu’au survol / focus
- `Reset factory` doit demander confirmation
- `Force refresh PWA` doit nettoyer service workers et caches puis recharger

## 10) Icône / PWA

- utiliser l’image locale `public/app-icon.png`
- favicon HTML : `app-icon.png`
- manifest PWA : même image 512×512
- icône plus jolie que les SVG initiaux

## 11) Router / base URL / GitHub Pages

- le router doit utiliser `createWebHistory(import.meta.env.BASE_URL)`
- le build doit supporter GitHub Pages sous `/z-ha-buttons/`
- en publication Pages :
  - base Vite = `/z-ha-buttons/`
  - manifest `start_url` et `scope` doivent suivre cette base
  - `404.html` doit exister pour le SPA fallback
  - `.nojekyll` doit être présent

## 12) Scripts NPM

- `npm run dev` : Vite dev server
- `npm run build` : build production
- `npm test` : Vitest
- `npm run preview` : preview strict sur `0.0.0.0:4173`
- `npm run preview:manual` : preview manuel dédié
- `npm run smoke:browser` : smoke headless avec un seul serveur preview

## 13) Tests à maintenir

Vitest couvre au minimum :
- version de l’application
- base router pour GitHub Pages
- icône / manifest
- logique changelog (extraction + comparaison + message)
- composant ButtonCard sans `entityId` affiché
- workflow smoke browser
- workflow preview manuel
- temporisation post-action : 2 s avant lecture + retries conservés

## 14) Procédures de travail à suivre à chaque modification

### Obligatoire
1. Faire la modification.
2. **Incrémenter la version** immédiatement.
3. Mettre à jour le `CHANGELOG.md`.
4. **Redémarrer le serveur local 4173** pour que la nouvelle version soit testable.
5. Lancer les tests pertinents.
6. Lancer `npm run build`.
7. Si changement visuel : vérifier avec browser headless.

### Règles du serveur local
- le développement et les tests se font sur le serveur local `4173`
- garder **un seul** serveur visible à la fois
- tuer les serveurs parasites avant d’en relancer un autre
- `preview:manual` doit rester ouvert jusqu’à arrêt manuel
- `smoke:browser` doit nettoyer ses processus automatiquement

### Règles de publication
- ne publier sur `gh-pages` **que sur demande explicite**
- la source de travail reste la branche `ver2`
- la branche de publication est `gh-pages`
- pour publier : construire, copier le contenu de `dist/` dans `gh-pages`, ajouter `404.html` et `.nojekyll`, puis pousser

## 15) Ordre de reconstruction recommandé

1. Créer le projet Vue 3 / Vite.
2. Installer `vue-router`, `dexie`, `vite-plugin-pwa`, `vitest`.
3. Mettre en place le thème sombre et le layout global.
4. Créer la base Dexie + store global.
5. Implémenter le chiffrement Web Crypto.
6. Implémenter Home Assistant via WebSocket.
7. Créer l’accueil + cartes + appui long.
8. Créer configuration + ajout / édition + détail lampe.
9. Créer ordre, CSV, Help, About, Tools menu.
10. Ajouter tests Vitest.
11. Ajouter icône PWA + manifest.
12. Préparer GitHub Pages.
13. Valider par build, tests et smoke headless.
14. Publier sur `gh-pages` uniquement quand demandé.

## 16) Variables d’environnement de test

Pour les tests Home Assistant/headless :
- `HA_URL`
- `HA_TOKEN`
- `HA_ENTITE_1`
- `HA_ENTITE_2`
- `HA_ENTITE_3`

## 17) Résumé de la règle d’or

Toujours partir du code source réel, reconstruire les comportements ci-dessus,
puis valider en local sur le port `4173` avant toute publication.
