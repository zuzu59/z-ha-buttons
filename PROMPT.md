# z-ha-buttons

zf260622.1533, zf260622.1838

## But

Créer une application PWA sur smartphone pour piloter facilement des boutons
Home Assistant afin d'allumer et d'éteindre des appareils via l'API.

## Objectif produit

- Application PWA moderne, simple et agréable à utiliser.
- Usage prioritaire sur smartphone, mais aussi confortable sur desktop.
- Déploiement sur GitHub Pages via la branche `gh-pages`, uniquement sur
  demande.

## Stack et base technique

- Vite.
- Vue.js 3.
- Dexie.js pour la base locale.
- `@vite-pwa/plugin` pour configurer automatiquement le Service Worker et le
  mode hors ligne.

## Contraintes techniques absolues

### Chiffrement et secrets

- Dérivation de clé uniquement via PBKDF2.
- Utiliser l'API native Web Crypto Subtle.
- Algorithme de hachage : SHA-256.
- Salt unique généré avec `crypto.getRandomValues()`.
- Minimum 600 000 itérations.
- Chiffrement uniquement avec AES-GCM 256 bits natif.
- Chaque chiffrement doit utiliser un IV de 12 octets unique et régénéré à
  chaque fois.
- Ne jamais stocker le mot de passe maître ni la clé dérivée.
- Ne stocker que le salt, l'IV et le blob chiffré
  (`ciphertext + auth tag`).

### Gestion mémoire

- Éviter au maximum les chaînes de caractères persistantes pour les mots de
  passe.
- Préférer `Uint8Array` dès que possible.
- Prévoir une fonction de wipe mémoire avec `.fill(0)` après utilisation.
- Prévoir un verrouillage automatique après X minutes d'inactivité.
- Le verrouillage doit effacer la clé dérivée de la mémoire de l'application.
- Ne proposer aucune bibliothèque obsolète comme CryptoJS ou sjcl.
- Utiliser uniquement l'API Web Crypto.

## Interface et navigation

- Interface simple, rapide, sexy et conviviale.
- Style sombre, moderne, lisible et très contrasté.
- Design mobile-first, mais utilisable sur desktop.
- Offline-first.
- Fiable et simple à maintenir.
- Boutons compacts et cohérents partout.
- Aucun retour à la ligne du titre de l'application dans la barre supérieure.
- Le champ de recherche ne doit jamais déformer le titre.
- Le hamburger doit rester discret, visible, et toujours à droite.
- Le menu doit rester compact.
- Quand on clique sur le titre en haut à gauche, on revient à la home page.

## Page principale

- Afficher les boutons sur deux colonnes.
- Afficher l'état actuel de chaque bouton via Home Assistant.
- Les boutons sont des toggles.
- À chaque clic, ils changent d'état.
- Un appui long sur un bouton lampe ouvre sa page de détail.
- Sur cette page, on peut régler l'intensité.
- Sur cette page, on peut régler la température de couleur.
- En haut à droite de la page de détail, un bouton `modifier` permet de
  reconfigurer le bouton complet.
- La page `modifier` est la même que la page d'ajout de bouton.

## Menu hamburger

L'ordre des entrées doit être le suivant :

- Help.
- Ordre d'affichage des boutons sur la page principale.
- Ajout d'un bouton.
- Configuration.
- Exportation en CSV de la configuration de l'application.
- Importation en CSV de la configuration de l'application.
- About.

## Configuration

Dans la page de configuration, définir :

- L'adresse du serveur Home Assistant.
- Le token de l'API Home Assistant.

## Ajout et modification d'un bouton

Dans la page d'ajout ou de modification d'un bouton, définir :

- Son entité Home Assistant.
- L'icône du bouton choisie parmi une liste d'icônes.
- La couleur du cadre du bouton.
- La date de création du bouton.
- La date de modification du bouton.

Les dates sont affichées, mais pas modifiables.

## Export et import

- Permettre l'export de toute la base en CSV.
- Permettre l'import de toute la base en CSV.
- Les mots de passe doivent être chiffrés à l'export.
- Lors de l'import, réinitialiser la base avant insertion.
- Il ne doit pas y avoir de fusion.
- Afficher un message clair de confirmation ou d'annulation.

## Git, commits et changelog

- Les commits doivent être atomiques.
- Utiliser les préfixes suivants : `new`, `change`, `fixe`, `refact`, `del`.
- Détailler toutes les actions dans les commits.
- Maintenir un changelog sur GitHub avec version, date et heure.
- Éviter les commits de travail inutiles du type
  `change: bump version to 0.0.x` sans valeur.
- Ne pas incrémenter la version si le commit ne modifie pas l'application
  buildée.
- Les releases GitHub doivent être utiles, détaillées et cohérentes.
- Les notes de release doivent être générées depuis les commits.
- Les anciennes releases doivent être rétro-remplies avec du contenu utile.
- Le changelog doit suivre le format Keep a Changelog, en français.
- Chaque version doit inclure la date et l'heure.
- Les entrées doivent rester dans l'ordre chronologique.
- Les sections du changelog doivent rester pertinentes.
- Les releases GitHub doivent garder le même niveau de détail que le
  changelog local.
- Quand un gros effort a été consacré au changelog, conserver cet historique
  détaillé.
- Les blocs de version doivent refléter les vraies améliorations produit :
  UI, sécurité, releases, workflows et corrections de bugs.

## Workflow Git et mini kanban

- Lire `kanban-a-faire.md` avant de commencer.
- Déplacer immédiatement toute tâche terminée dans `kanban-termine.md`.
- Travailler une seule tâche à la fois.
- Garder le projet déployable à tout moment.
- Le kanban est la source simple de vérité pour la prochaine action.
- Les tâches doivent être courtes, concrètes et orientées résultat.
- Quand une tâche est finie, elle doit quitter `kanban-a-faire.md`
  immédiatement.
- Garder le kanban propre : pas de doublons, pas de tâches floues, pas
  d'éléments non actionnables.
- Préférer un mini kanban clair plutôt qu'un backlog lourd.

## Validation locale par navigateur

À chaque modification de code, suivre strictement cet ordre :

1. Construire l'application avec `npm run build`.
2. Démarrer le serveur local une seule fois avec
   `pm2 start npm --name "pwa-serve" -- run preview`.
3. Inspecter le résultat avec Playwright Chromium sur `0.0.0.0:4173`.
4. Faire une capture d'écran ou analyser le HTML généré.
5. Corriger tout bug visuel ou erreur détectée.
6. Recommencer depuis l'étape 1 jusqu'à obtenir un résultat parfait.

Règles associées :

- Ne jamais valider une UI uniquement via le DOM.
- Conserver toutes les captures dans `copies-d-ecrans/` et elles doivent avoir un timestamp yymmdd.hhmm.
- Le serveur local de validation doit utiliser `host 0.0.0.0` et le port
  `4173`.
- Si un autre port existe, le fermer pour n'en garder qu'un seul.
- Le serveur local sert à itérer rapidement, sans déployer à chaque
  modification.
- Incrémenter la version à chaque modification de code afin de vérifier que
  la dernière version est bien utilisée.

## Déploiement

- Déployer uniquement quand cela est demandé.
- Le site doit rester déployable sur GitHub Pages via `gh-pages`.
- Après push, vérifier GitHub Actions et les déploiements.
- Ne pousser ou publier qu'après validation locale visuelle.
- Les artefacts de build doivent rester compatibles avec GitHub Pages.
- Corriger les problèmes de workflow GitHub avant de considérer la livraison
  comme terminée.
- Si la modification ne change pas l'application elle-même
  (prompt, documentation, kanban, notes), il est possible de pousser sans
  incrémenter la version applicative ni redéployer.
- Pousser le changelog et la version dans le système de release GitHub.

## Menu About

Le menu About doit afficher :

- Le profil GitHub `GitHub.com/zuzu59`.
- Le dépôt GitHub de l'application.
- La version de l'application.
- Un lien vers le changelog.

### Comportement About

- Au chargement, vérifier la dernière release GitHub.
- Si une version plus récente existe, afficher `Nouvelle version disponible`.
- Le clic sur la version ouvre le changelog GitHub.
- Les boutons de la page About doivent respecter une hauteur compacte.
- La vérification de release doit rester fiable malgré le cache navigateur ou
  un refresh.

## Versions, releases et changelog

- Version affichée en bas de chaque page.
- Versionnement en `0.0.x`.
- Releases GitHub utiles et détaillées.
- Ne pas incrémenter la version si le commit ne modifie pas l'application
  buildée.
- Changelog en français au format Keep a Changelog.
- Chaque version doit inclure la date et l'heure.
- Le changelog doit détailler les commits, sans ligne vide inutile.
- Les anciennes releases GitHub doivent être rétro-remplies avec du contenu
  utile.
- Les notes de release doivent être générées depuis les commits.
- Éviter les commits de travail absurdes du type
  `change: bump version to 0.0.x` sans valeur.
- Utiliser des commits atomiques avec les préfixes `new`, `change`, `fixe`,
  `refact`, `del`.
- La reconstruction du changelog doit partir des commits réels, avec du détail
  utile.
- Les entrées de version doivent garder l'ordre chronologique et les sections
  pertinentes.
- Les releases GitHub doivent reprendre le même niveau de détail que le
  changelog local.
- Quand un gros effort a été consacré au changelog, il faut conserver
  l'historique détaillé.
- Les blocs de version doivent refléter les vraies améliorations produit :
  UI, sécurité, releases, workflows et corrections de bugs.

## Règle finale

Un agent qui suit uniquement ce fichier doit pouvoir reconstruire une
application fonctionnellement équivalente à Z-Services, avec les mêmes choix
UX, sécurité, versions, releases, validation visuelle et workflow de
maintenance.
