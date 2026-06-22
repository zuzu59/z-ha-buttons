# Analyse du projet `z-ha-buttons`

Date d'analyse : 2026-06-22
Branche courante : `dev`

## 1. Résumé exécutif

Ce dépôt ne contient pas encore l'application elle-même.
Il s'agit aujourd'hui surtout d'un cahier des charges très précis,
centré sur la future PWA de pilotage Home Assistant.

Le projet vise une application mobile-first, hors ligne, simple à
utiliser, avec une forte exigence sur la sécurité, les releases,
le workflow Git et la validation visuelle.

En l'état, le dépôt est donc une base de spécification plus qu'une
base logicielle exécutable.

## 2. Contenu réel du dépôt

Fichiers visibles hors `.git` :

- `.gitignore`
- `LICENSE`
- `README.md`
- `PROMPT.md`

Constat important :

- aucun `package.json`
- aucun dossier `src/`
- aucune configuration Vite
- aucune configuration Vue
- aucune configuration PWA
- aucune base Dexie
- aucune page d'application
- aucun test
- aucune CI
- aucun dossier de capture d'écran
- aucun kanban présent dans le dépôt

Conclusion : le projet n'est pas encore bootstrappé comme application.

## 3. Lecture fonctionnelle du besoin

Le produit attendu est une PWA de contrôle Home Assistant qui doit
permettre :

- de lister des boutons de contrôle sur deux colonnes
- de gérer des appareils via toggle
- d'ouvrir un détail avancé pour les lampes
- de modifier la configuration d'un bouton
- de stocker la configuration localement
- d'importer et d'exporter la base en CSV
- de fonctionner en hors ligne
- de s'ouvrir proprement sur smartphone et desktop

Le besoin est très orienté usage quotidien, avec peu d'écrans mais un
haut niveau d'exigence sur la cohérence et la rapidité.

## 4. Analyse du document `PROMPT.md`

Le fichier `PROMPT.md` est le document central du projet.
Il formalise la quasi-totalité des règles attendues.

### 4.1 Objectif produit

Le produit cible est clair :

- PWA dédiée à Home Assistant
- contrôle simplifié de boutons
- expérience mobile prioritaire
- déploiement GitHub Pages uniquement sur demande

### 4.2 Stack technique imposée

Le prompt impose :

- Vite
- Vue 3
- Dexie.js
- `@vite-pwa/plugin`
- Web Crypto natif

Cela fixe un socle moderne, léger et compatible navigateur.

### 4.3 Sécurité

La partie sécurité est la plus détaillée du document.
Les exigences sont fortes :

- PBKDF2 seulement
- SHA-256
- salt aléatoire via `crypto.getRandomValues()`
- au moins 600 000 itérations
- AES-GCM 256 bits
- IV unique de 12 octets par chiffrement
- pas de stockage du mot de passe maître
- pas de stockage de la clé dérivée
- conservation uniquement du salt, de l'IV et du blob chiffré
- wipe mémoire des buffers sensibles
- verrouillage automatique après inactivité

Cette section impose une conception crypto très stricte et
presque entièrement native au navigateur.

### 4.4 UX et navigation

Le document décrit une UX sobre mais précise :

- thème sombre
- interface compacte
- navigation simple
- bouton hamburger en haut à droite
- titre cliquable qui revient à l'accueil
- affichage en deux colonnes sur la page principale
- menu compact et stable
- comportement long press pour les lampes

Le besoin UX est très cadré.

### 4.5 Gestion des boutons

Le modèle de bouton attendu comprend :

- entité Home Assistant
- icône
- couleur du cadre
- dates de création et de modification
- comportement toggle
- réglages avancés pour les lampes

Cela suggère une entité locale riche, probablement stockée en Dexie.

### 4.6 Import / export

Le projet doit gérer :

- export CSV complet
- import CSV complet
- réinitialisation avant import
- absence de fusion
- feedback explicite de confirmation ou d'annulation

Le flux doit donc être très contrôlé.

### 4.7 Git, releases et changelog

Le prompt impose un vrai processus de maintenance :

- commits atomiques
- préfixes normalisés
- changelog en français
- format Keep a Changelog
- versionnage `0.0.x`
- releases GitHub détaillées
- notes de release dérivées des commits
- historique rétro-rempli si nécessaire

Le dépôt ne sert pas seulement à coder, mais à documenter et à
industrialiser la maintenance.

### 4.8 Validation locale

Une procédure de validation visuelle est imposée :

1. build
2. serveur local
3. inspection Playwright
4. capture d'écran
5. correction
6. itération

Cela montre une volonté de ne jamais valider uniquement le DOM.

## 5. Historique Git observé

Commits visibles :

- `fa66169` — Initial commit
- `e3979a4` — first commit
- `4f3da9c` — refactor du prompt, suppression de `PROMPT-2.md`
- `6872862` — commit vide pour matérialiser la branche `dev`

Lecture de l'historique :

- le dépôt a démarré très tôt comme base de projet
- l'activité principale a porté sur la spécification
- la branche `dev` existe désormais et est poussée sur GitHub
- aucun vrai code produit n'a encore été ajouté

## 6. État de maturité du projet

### Ce qui est déjà bien défini

- le besoin métier
- le style d'interface
- les contraintes de sécurité
- le workflow de livraison
- la logique de versioning
- la logique de release

### Ce qui manque encore

- bootstrap de l'application
- structure de projet
- pages Vue
- stockage Dexie
- intégration Home Assistant
- import / export CSV
- PWA
- tests
- pipeline de build
- pipeline de validation
- documentation technique d'implémentation

Le dépôt est donc conceptuellement riche, mais techniquement vide.

## 7. Points de vigilance

### 7.1 Contradictions ou tensions

Quelques règles peuvent entrer en tension :

- incrémenter la version à chaque modification de code
  vs ne pas incrémenter si le commit ne modifie pas l'app buildée
- faire un build systématique à chaque changement
  vs maintenir un travail rapide sur le port `4173`
- garder un prompt très détaillé
  vs éviter un code trop complexe à maintenir

Ces règles doivent être arbitrées avec discipline.

### 7.2 Risques techniques

- gestion sécurisée des secrets dans le navigateur
- fiabilité des imports CSV
- cohérence entre état local et état Home Assistant
- ergonomie mobile sans surcharge UI
- maintien de la compatibilité GitHub Pages

### 7.3 Risques produit

- trop de règles de process pour un petit projet
- dérive entre le prompt et l'implémentation réelle
- complexité du changelog si les commits ne sont pas strictement
  atomiques

## 8. Lecture architecturale implicite

Même sans code, le prompt permet d'inférer une architecture cible :

- Vue 3 pour l'interface
- Vite pour le build
- Dexie pour le stockage local
- Web Crypto pour les secrets
- PWA pour l'usage hors ligne
- CSV pour les échanges de configuration
- Home Assistant comme backend externe

En pratique, cela ressemble à une application de gestion locale
avec synchronisation d'actions vers Home Assistant.

## 9. Recommandation de mise en œuvre

L'ordre logique de construction devrait être :

1. bootstrap Vite + Vue 3
2. ajouter PWA
3. poser le modèle Dexie
4. implémenter la configuration Home Assistant
5. intégrer la liste des boutons
6. gérer le toggle
7. ajouter le détail lampe
8. ajouter import / export CSV
9. ajouter chiffrement
10. ajouter About / release / changelog
11. ajouter tests et validation visuelle

## 10. Conclusion

Le dépôt est aujourd'hui surtout une spécification très ambitieuse.
Il décrit un produit final assez précis, mais il ne contient pas encore
l'application.

La qualité principale du projet est la clarté du besoin.
La principale étape restante est la transformation de cette spécification
en structure d'application réelle.
