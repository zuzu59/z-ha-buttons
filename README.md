# z-ha-buttons

PWA mobile-first Vue 3 pour piloter des appareils Home Assistant.

## Fonctionnalités

- 🏠 Connexion WebSocket à Home Assistant
- 💡 Boutons toggle (switchs et lampes)
- 🎛️ Contrôle luminosité / température couleur
- 🔒 Chiffrement AES-GCM pour le token HA
- 📱 PWA installable (service worker)
- 📁 Export / Import JSON
- 📋 Ordre d'affichage personnalisable
- 🔐 Verrouillage avec master password
- 🌙 Thème sombre profond
- 📄 Support GitHub Pages

## Stack

- Vue 3 + Vite + vue-router
- Dexie (IndexedDB)
- Web Crypto API (AES-GCM + PBKDF2)
- Home Assistant WebSocket API
- vite-plugin-pwa

## Développement

```bash
npm run dev        # Dev server sur :4173
npm run build      # Build production
npm test           # Tests Vitest
npm run preview    # Preview production
```

## Publication

```bash
# GitHub Pages (branche gh-pages)
npm run build
# Copier dist/ vers gh-pages, ajouter 404.html + .nojekyll
```

## Licence

MIT
