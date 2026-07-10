# z-ha-buttons

PWA mobile-first pour piloter des boutons Home Assistant depuis une interface
locale, rapide et pensée pour le mobile.

## Ce que fait l’application

- enregistre la configuration Home Assistant en local
- chiffre le token et le mot de passe maître
- synchronise l’état des entités avec Home Assistant
- affiche les boutons en grille d’accueil
- ouvre un détail avancé pour les lampes
- permet l’import / export CSV
- conserve les données dans Dexie

## Prérequis

- Node.js récent
- Home Assistant accessible depuis l’app
- un token Home Assistant valide

## Installation

```bash
npm install
```

## Démarrage en local

```bash
npm run dev
```

## Vérification / build

```bash
npm run build
npm test
```

## Prévisualisation

- `npm run preview` : serveur preview strict sur le port `4173`
- `npm run preview:manual` : preview manuel dédié, laissé ouvert pour les tests
- `npm run smoke:browser` : smoke headless avec un seul serveur preview

## Utilisation rapide

1. Ouvre **Configuration**.
2. Renseigne l’URL Home Assistant, le token et le mot de passe maître.
3. Ajoute tes boutons via **Ajout d’un bouton**.
4. Reviens à l’accueil pour piloter les entités.
5. Utilise un appui long sur une lampe pour accéder au détail.

## Menu principal

- **Ajout d’un bouton** : créer un bouton Home Assistant
- **Ordre d’affichage des boutons** : réorganiser l’accueil
- **Tools** : configuration, CSV, refresh PWA, reset factory
- **Help** : guide de démarrage et d’utilisation
- **About** : version, changelog et liens GitHub

## Notes

- Application hors ligne.
- Base locale via Dexie.
- Secrets chiffrés via Web Crypto.
- Le serveur preview attend le port `4173`.
