# Journal des modifications

Toutes les modifications notables de ce projet sont consignées ici.

## [0.0.20] - 2026-07-10 21:22

### Modifié

- Les cartes d’accueil n’affichent plus le nom technique des entités Home
  Assistant.
- Le rendu des boutons est plus épuré sur la page principale.
- L’affichage reste centré sur le libellé métier, l’icône et l’état.

### Tests

- Ajout d’une couverture de non-régression pour vérifier que le nom de
  l’entité n’apparaît pas sur une carte d’accueil.
- Validation du rendu SSR du composant `ButtonCard`.

## [0.0.19] - 2026-07-10 20:43

### Ajouté

- Script `preview:manual` dédié à la prévisualisation manuelle sur le port
  `4173`.
- Alias de lancement manuel séparé du smoke browser automatique.
- Helper de smoke browser qui démarre un seul serveur preview strict et
  nettoie proprement le navigateur et le serveur après vérification.

### Tests

- Couverture de la version affichée dans l’interface.
- Couverture du workflow de smoke browser.
- Couverture du lancement manuel du preview.

### Modifié

- Le menu npm expose désormais une commande de preview manuelle explicite.
- Le flux de vérification automatisée s’appuie sur un serveur unique et
  reproductible.

## [0.0.18] - 2026-06-23 18:51

### Modifié

- La section `Tools` se déplie désormais au survol.
- Les actions de maintenance sont cachées tant que `Tools` n’est pas ouvert.
- Le menu principal reste plus compact et plus lisible.

## [0.0.17] - 2026-06-23 18:38

### Modifié

- Réorganisation du hamburger avec une hiérarchie claire.
- Section `Tools` dédiée aux actions de maintenance.
- Mise en retrait visuelle des entrées de maintenance dans le menu.

## [0.0.16] - 2026-06-23 18:30

### Modifié

- Le rafraîchissement d’un bouton ne réinitialise plus les autres cartes.
- Les états déjà chargés restent visibles quand un bouton est actionné.
- L’expérience de navigation home / détail reste cohérente après toggle.

## [0.0.15] - 2026-06-23 18:18

### Modifié

- La page d’accueil recharge automatiquement les états Home Assistant au
  chargement.
- Les statuts affichés sur les cartes reflètent maintenant l’état réel.
- Le retour sur l’accueil rafraîchit les boutons sans action manuelle.

## [0.0.14] - 2026-06-23 18:18

### Modifié

- Correction du déplacement des boutons dans l’ordre d’affichage.
- Sauvegarde robuste des réordonnancements dans la base locale.
- L’ordre choisi reste bien conservé après reload.

## [0.0.13] - 2026-06-22 23:58

### Modifié

- Le tri des boutons se sauvegarde automatiquement à chaque modification.
- Le formulaire d’ordre n’a plus besoin de bouton `Enregistrer`.
- La liste d’accueil conserve l’ordre choisi après retour et rechargement.

## [0.0.12] - 2026-06-22 23:50

### Ajouté

- Réouverture automatique des valeurs de configuration depuis la base locale.
- Boutons œil pour afficher ou masquer le token et le mot de passe maître.

### Modifié

- La page Configuration restaure maintenant le token et le mot de passe
  maître existants.
- Les champs de la configuration ne sont plus vidés après enregistrement.
- Confirmation préremplie pour faciliter la sauvegarde d’une configuration
  existante.

## [0.0.11] - 2026-06-22 23:40

### Modifié

- Les appels Home Assistant de l’application passent désormais par le
  WebSocket API du navigateur.
- Le bouton d’état fonctionne même sans CORS REST sur l’instance HA.
- Le test de connexion utilise le même canal fiable que les actions de
  contrôle.
- Le clic sur un bouton déclenche enfin un toggle réel depuis l’interface.

## [0.0.10] - 2026-06-22 23:09

### Modifié

- L’application attend désormais l’initialisation complète avant d’être
  montée.
- Le modal de déverrouillage n’apparaît plus brièvement puis disparaît au
  reload.
- La restauration de l’état au démarrage est effectuée avant le premier
  rendu.

## [0.0.9] - 2026-06-22 22:59

### Modifié

- Le déverrouillage au démarrage ne dépend plus d’une requête réseau.
- L’application reste déverrouillée même si Home Assistant est indisponible.
- L’ouverture après reload ne retombe plus en mode verrouillé à cause du
  backend.
- L’enregistrement de la configuration continue de fonctionner sans test de
  connexion.

## [0.0.8] - 2026-06-22 22:55

### Modifié

- L’enregistrement de la configuration ne teste plus la connexion Home
  Assistant.
- Il est désormais possible de configurer l’application avec un serveur
  momentanément inactif.
- Le bouton `Tester la connexion` reste le seul point de validation réseau.

## [0.0.7] - 2026-06-22 22:47

### Ajouté

- Entrée `Reset factory` en tête du hamburger.
- Réinitialisation complète de la base locale via confirmation explicite.
- Retour immédiat à l’écran d’accueil après reset.

### Modifié

- Le reset usine remet aussi l’état mémoire à zéro.
- Préparation d’un vrai départ propre quand le cache local est incohérent.

## [0.0.6] - 2026-06-22 22:37

### Ajouté

- Entrée `Force refresh PWA` dans le hamburger.
- Nettoyage des caches navigateur et désenregistrement du service worker.
- Rechargement avec paramètre de cache-busting pour forcer une version
  fraîche.

### Modifié

- Amélioration du confort de maintenance lors des effets de cache PWA.

## [0.0.5] - 2026-06-22 22:28

### Modifié

- Le mot de passe maître est désormais réécrit dans la base à chaque
  déverrouillage.
- Le reload d’une session déjà déverrouillée reste bien déverrouillé.
- Le comportement de restauration au démarrage est fiabilisé.

## [0.0.4] - 2026-06-22 22:20

### Modifié

- Le mot de passe maître est maintenant conservé dans la base locale.
- L’application se déverrouille automatiquement au rechargement.
- Suppression du mécanisme de timeout de verrouillage automatique.
- Le flux de verrouillage est simplifié et reste cohérent au refresh.

## [0.0.3] - 2026-06-22 22:07

### Modifié

- Le bouton `Annuler` de la fenêtre de déverrouillage ferme enfin le modal.
- L’état déverrouillé est mémorisé pendant la session via `sessionStorage`.
- Le retour à l’accueil ne redemande plus systématiquement le mot de passe.
- Amélioration du flux de verrouillage avec un vrai dialogue réouvrable.

## [0.0.2] - 2026-06-22 18:44

### Modifié

- Validation de connexion Home Assistant avant enregistrement.
- Ajout d’un bouton de test pour vérifier `/api/`.
- Affichage du nom de l’instance Home Assistant dans la configuration.
- Messages d’erreur plus explicites pour les statuts HTTP et les échecs
  réseau/CORS.
- Correction de l’enregistrement des nouveaux boutons dans Dexie.
- Captures d’écran désormais horodatées au format `yymmdd.hhmm`.

## [0.0.1] - 2026-06-22 18:24

### Ajouté

- Bootstrap initial de l’application Vue 3 / Vite.
- Intégration de la PWA.
- Stockage local avec Dexie.
- Chiffrement natif Web Crypto pour les secrets.
- Écran de configuration Home Assistant.
- Accueil en grille à deux colonnes.
- Détail des lampes avec réglage de l’intensité et de la température.
- Formulaire d’ajout et de modification des boutons.
- Réorganisation des boutons.
- Export et import CSV complets.
- Page Help.
- Page About avec vérification de release GitHub.

### Sécurité

- Dérivation PBKDF2 SHA-256.
- AES-GCM 256 bits.
- Salt et IV générés aléatoirement.
- Verrouillage d’application.

### Maintenance

- Version affichée dans le pied de page.
- Workflow Git et kanban préparés.
