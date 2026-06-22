# Plan de réalisation one shot

Date : 2026-06-22

## 1. But du plan

Transformer ce dépôt, qui est aujourd'hui surtout une spécification,
en une application PWA complète, livrable et cohérente, en une séquence
unique de livraison.

L'objectif est de limiter les allers-retours et de construire l'ensemble
du produit dans un ordre strict : fondations, cœur métier, sécurité,
expérience utilisateur, import/export, validation, releases.

## 2. Principe one shot

Le mode one shot signifie :

- partir du besoin complet avant de coder
- construire une base saine dès le début
- éviter les branches de travail longues et les retours inutiles
- garder l'application exécutable à chaque étape
- valider visuellement avant de continuer

La logique est de livrer un produit cohérent d'un seul tenant,
puis de stabiliser et de documenter.

## 3. Résultat attendu

À la fin de l'exécution, le projet doit fournir :

- une PWA Vue 3 / Vite installée et opérationnelle
- un stockage local Dexie
- un mode hors ligne fonctionnel
- une intégration Home Assistant
- une configuration chiffrée des secrets
- une page principale avec boutons en deux colonnes
- des détails lampes avec contrôle avancé
- un import / export CSV complet
- un menu About fiable
- un changelog et un versionnage propres
- une validation locale avec captures d'écran

## 4. Ordre d'exécution

### Étape 1 : bootstrap technique

- créer la structure du projet
- ajouter Vite
- ajouter Vue 3
- ajouter `@vite-pwa/plugin`
- ajouter Dexie
- définir les scripts de base
- créer la structure de routes et composants
- préparer le thème sombre et le layout mobile-first

### Étape 2 : modèle de données

- définir les tables locales
- modéliser la configuration Home Assistant
- modéliser les boutons
- modéliser l'historique minimal nécessaire
- prévoir les champs de dates
- prévoir l'ordre d'affichage

### Étape 3 : sécurité

- implémenter PBKDF2 + SHA-256
- implémenter AES-GCM
- gérer salt, IV et blob chiffré
- ajouter le wipe mémoire
- ajouter le verrouillage automatique
- vérifier que rien de sensible n'est persisté en clair

### Étape 4 : configuration Home Assistant

- créer l'écran de configuration
- enregistrer l'URL du serveur
- enregistrer le token chiffré
- tester la lecture des états
- tester le toggle d'une entité

### Étape 5 : page principale

- afficher les boutons sur deux colonnes
- afficher l'état courant
- gérer le toggle au clic
- gérer le long press
- garder un header compact
- rendre le titre cliquable vers l'accueil
- garder le hamburger discret à droite

### Étape 6 : détail lampe

- ouvrir une page de détail sur long press
- gérer l'intensité
- gérer la température de couleur
- ajouter le bouton modifier
- réutiliser le même formulaire d'ajout / édition

### Étape 7 : formulaire bouton

- créer l'ajout de bouton
- créer la modification de bouton
- gérer l'entité Home Assistant
- gérer l'icône
- gérer la couleur du cadre
- afficher création et modification sans édition

### Étape 8 : import / export CSV

- exporter toute la base
- chiffrer les secrets exportés
- importer un CSV complet
- remettre la base à zéro avant import
- afficher confirmation ou annulation
- tester les cas d'erreur

### Étape 9 : menu, about et release

- implémenter le menu hamburger
- respecter l'ordre demandé
- créer About
- vérifier la dernière release GitHub
- afficher `Nouvelle version disponible`
- lier la version au changelog

### Étape 10 : finition UX

- vérifier le responsive mobile et desktop
- réduire les espaces inutiles
- harmoniser les boutons
- vérifier la lisibilité
- vérifier l'absence de wrap du titre
- vérifier la stabilité des menus

### Étape 11 : validation

- lancer le build
- lancer le serveur local sur `0.0.0.0:4173`
- ouvrir l'application avec Playwright
- faire des captures d'écran
- corriger les défauts
- recommencer jusqu'à résultat propre

### Étape 12 : documentation et release

- rédiger le changelog
- mettre à jour la version
- préparer la release GitHub
- vérifier les actions GitHub
- pousser uniquement une version stable

## 5. Livrables concrets

Le one shot doit produire au minimum :

- un projet fonctionnel
- un README utile
- un `PLAN.md`
- un `ANALYSE.md`
- un `CHANGELOG.md`
- une structure de tests ou au moins un point d'entrée
- des captures de validation dans `copies-d-ecrans/`

## 6. Critères de fin

Le projet est considéré terminé quand :

- l'application démarre sans erreur
- les écrans principaux sont complets
- les secrets sont chiffrés correctement
- l'import / export fonctionne
- l'interface est propre sur mobile
- la validation visuelle est propre
- la version et le changelog sont cohérents
- la branche de livraison est prête à être publiée

## 7. Règle de pilotage

Si une décision produit ou technique bloque la livraison, elle doit être
tranchée immédiatement, documentée, puis intégrée au flux principal.

Le but n'est pas de multiplier les micro-tâches, mais d'aller vers une
version utilisable, cohérente et maintenable en une passe.
