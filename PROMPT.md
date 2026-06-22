# z-ha-buttons
zf260622.1533, zf260622.1625


# Buts
Avoir une application PWA sur mon smartphone qui me permet de gérer facilement des boutons pour allumer éteindre des appareils via l'api de home assistant.


# Conditions de développement
* Je veux créer un projet de PWA avec Vite, Vue.js 3 et Dexie.js pour la base de données locale. Utilise le plugin @vite-pwa/plugin pour configurer automatiquement le Service Worker et le mode hors-ligne.

* Je veux que cela soit facile à utiliser depuis un smartphone mais aussi sur un browser desktop.

* Je veux qu'elle soit déployée dans la branche gh-pages dans une Github Pages (afin d'être déployable via Internet) uniquement lorsque je le demande.

* Contraintes techniques absolues que tu dois respecter dans tout le code que tu vas générer :

    - Dérivation de clé : Utilise uniquement PBKDF2 (via l'API native Web Crypto Subtle) avec SHA-256, un Salt unique généré aléatoirement par crypto.getRandomValues(), et un minimum de 600 000 itérations pour dériver le mot de passe maître en clé AES.
    - Chiffrement : Utilise l'algorithme AES-GCM (256 bits) natif pour chiffrer et déshiffrer les données des mots de passe. Chaque chiffrement doit utiliser un vecteur d'initialisation (IV) de 12 octets unique et régénéré à chaque fois.
    - Gestion de la mémoire : Évite au maximum de stocker les mots de passe dans des chaînes de caractères (strings) persistantes en JavaScript. Privilégie l'utilisation de Uint8Array et propose une fonction pour écraser (wipe) la mémoire avec des zéros (.fill(0)) après utilisation.
    - Ne stocke JAMAIS le mot de passe maître ni la clé dérivée. Stocke uniquement le sel (Salt), le vecteur d'initialisation (IV) et le blob chiffré (cipher text + auth tag).
    - Ajoute un mécanisme de verrouillage automatique après X minutes d'inactivité (qui efface la clé dérivée de la mémoire de l'application).
    - Ne propose aucune bibliothèque externe obsolète comme CryptoJS ou sjcl. Utilise uniquement l'API Web Crypto.


# Directives

* L'interface doit être simple, rapide, sexy et conviviale !

* Les boutons, avec leur état actuel sur home assistant, sont affichés sur deux colonnes sur la page principale.

* C'est des boutons toggle, à chaque clic ils changent d'état

* Si on appuie longtemps sur un bouton et que c'est une lampe, on arrive dans le détail du bouton où l'on peut choisir l'intensité et la température de couleur.

* Sur cette page de détails, il y a en haut à droite un bouton 'modifier' qui permet de configurer le bouton au complet y compris sa couleur et son icône (même page que ajouter bouton).

* Sur la page principale, il y a un hamburger en haut à droite avec un menu. 

* Les menus du hamburger sont, dans l'ordre: 
    - Help
    - Ordre d'affichage des boutons sur la page principale 
    - Ajout d'un bouton
    - Configuration 
    - Exportation en CSV de la configuration de l'application 
    - Importation en CSV de la configuration de l'application 
    - About

* Dans la page configuration on définit:
    - L'adresse du serveur home assistant 
    - Le token de l'api de home assistant 

* Dans la page ajout ou modification d'un bouton on définit:
    - Son entité sur home assistant 
    - L'icône du bouton choisi parmis un choix d'icones
    - La couleur du cadre du bouton
    - La date de création du bouton
    - La date de modification du bouton
    (Les dates sont affichées mais pas modifiables )

* Je veux pouvoir exporter ou importer toute la db en csv. Les passwords seront chiffrés.
Lors de l'importation, il y aura remise à zéro de la db (pas de fusion) avec un message indiquant la confirmation ou annulation !

* Le commit, doit être atomic avec les préfixes new, change, fixe, refact, del détaillés de toutes les actions effectuées et après un changelog avec version + date et heure doit être tenu sur GitHub 

* Je veux que pour le dévelopement on travail sur un serveur web local sur allumé en permanence sur le port 4173

* je veux que chaque copie d'écran de vérification soit sauvegardée dans le dossiers copies-d-ecran et poussé aussi sur Github

* Quand on clique sur le titre de l'application en haut à gauche cela se positionne sur la home page de l'application


## Le menu About
Doit afficher :
- le profil GitHub `GitHub.com/zuzu59`
- le dépôt GitHub de l’application
- la version de l’application
- un lien vers le changelog

Comportement About :
- au chargement/ouverture, vérifier la dernière release GitHub
- si une version plus récente existe, afficher “Nouvelle version disponible”
- le clic sur la version ouvre le changelog GitHub
- les boutons de la page About doivent respecter la règle de hauteur compacte
- la vérification de release doit rester fiable même avec cache navigateur / refresh

## Versions / releases / changelog
- Version affichée en bas de chaque page.
- Versionnement en `0.0.x`.
- Releases GitHub utiles et détaillées.
- Ne pas incrémenter la version si le commit ne modifie pas l’application buildée.
- Changelog en français au format **Keep a Changelog**.
- Chaque version doit inclure **date et heure**.
- Le changelog doit détailler les commits, pas une ligne vide.
- Les anciennes releases GitHub doivent être rétro-remplies avec du contenu utile.
- Les notes de release doivent être générées depuis les commits.
- Éviter les commits de travail absurdes du type `change: bump version to 0.0.x` sans valeur.
- Utiliser des commits atomiques avec les préfixes : `new`, `change`, `fixe`, `refact`, `del`.
- La reconstruction du changelog doit partir des commits réels, avec du détail utile.
- Les entrées de version doivent garder l’ordre chronologique et les sections pertinentes.
- Les releases GitHub doivent reprendre le même niveau de détail que le changelog local.
- Quand un gros effort a été consacré au changelog, il faut conserver l’historique détaillé.
- Les blocs de version doivent refléter les vraies améliorations produit : UI, sécurité, releases, workflows, corrections de bugs.

## Workflow Git / mini kanban
- Lire `kanban-a-faire.md` avant de commencer.
- Déplacer immédiatement toute tâche terminée dans `kanban-termine.md`.
- Travailler une tâche à la fois.
- Garder le projet déployable à tout moment.
- Le kanban est la source simple de vérité pour la prochaine action.
- Les tâches doivent être courtes, concrètes et orientées résultat.
- Quand une tâche est finie, elle doit quitter `kanban-a-faire.md` immédiatement.
- Le kanban doit rester propre : pas de doublons, pas de tâches floues, pas d’éléments non actionnables.
- Préférer un **mini kanban** très clair plutôt qu’un backlog lourd.

## Cycle de validation par le navigateur (impératif)
À chaque fois que tu termines une modification de code, tu dois suivre scrupuleusement ces étapes dans l'ordre pour vérifier ton travail :
1 Build l'application : Exécute npm run build pour compiler le projet et t'assurer qu'il n'y a aucune erreur de syntaxe.
2 Démarre le serveur (uniquement la première fois) : Exécute pm2 start npm --name "pwa-serve" -- run preview. Le site sera disponible localement.
3 Inspecte le résultat avec Playwright : Lance un script Playwright (Chromium) pour ouvrir la page locale (0.0.0.0 4173), faire une capture d'écran de l'interface, ou analyser le code HTML généré.
4 Auto-correction : Si la capture d'écran montre un bug visuel ou si Playwright détecte une erreur, corrige ton code et recommence à l'étape 1. Ne t'arrête que lorsque le résultat visuel est parfait.
Et encore:
- Ne jamais valider une UI sur le DOM seul.
- Conserver toutes captures dans `copies-d-ecrans/`.
- Le serveur local de validation doit utiliser ***host 0.0.0.0 4173**.
- Si un autre port existe, le fermer pour n’utiliser que **4173**.
- Le serveur local sert au développement rapide : il doit permettre d’itérer sans avoir besoin de déployer sur GitHub à chaque modification.
- Incrémenter la version à chaque midification du code afin que je puisse vérifier que je tourne la dernière version !

## Déploiement, seulement quand je le demande
- Le site doit être déployable sur GitHub Pages depuis la branche gh-pages.
- Après push, vérifier GitHub Actions / Deployments.
- Ne pousser / publier qu’après validation locale visuelle.
- Les artefacts de build doivent rester compatibles avec GitHub Pages.
- Les problèmes de workflow GitHub doivent être corrigés avant de considérer la livraison comme terminée.
- Si la modification ne change pas l’application elle-même (ex. prompt, documentation, kanban, notes), il est possible de pousser sans incrémenter la version applicative ni redéployer l’app.
- pousser le changlog et la version dans le système de release de Github

## Style attendu
- Interface sombre, bien constrasté, moderne.
- Mobile-first.
- Offline-first.
- Fiable.
- Lisible.
- Simple à maintenir.
- Boutons compacts et cohérents partout.
- Aucun wrap du titre de l’app dans la barre supérieure.
- Le champ de recherche ne doit jamais déformer le titre.
- Le hamburger doit rester accessible et discret, toujours à droite.
- Le menu doit être visible mais compact.

## Règle finale
Un agent qui suit uniquement ce fichier doit être capable de reconstruire une application **fonctionnellement équivalente** à Z-Services, 
avec les mêmes choix UX, sécurité, versions, releases, validation visuelle et workflow de maintenance.




