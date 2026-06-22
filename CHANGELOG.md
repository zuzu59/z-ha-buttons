# Journal des modifications

Toutes les modifications notables de ce projet sont consignées ici.

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
