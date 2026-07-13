# CHANGELOG — z-ha-buttons

## v0.0.6

- Tests E2E headless Playwright (config HA, création bouton, toggle)
- Fix version Dexie 1→10 (match navigateur)
- Fix ButtonDetail: parseInt(route.params.id) pour getButton
- Fix App.vue: id='app' dupliqué (causait page blanche)
- Home.vue: orderedButtons en computed (réactif)
- Token HA masqué (type=password) dans screenshots
- Timestamp screenshots: yymmdd.hhmm
- Connexion WebSocket HA validée (token JWT valide)
- VERSION: 0.0.6 — E2E + fixes boutons

## v0.0.5

- Design system officiel (DESIGN.md + .impeccable/design.json)
- Alignement au design system (anti-gradient text, focus-visible, reduced-motion)
- Bouton-card avec glow tactile renforcé
- Palette enrichie (8 tons bleu nuit + accents)
- Glow boutons électrique + hover animé
- Focus ring halo bleu
- Inputs avec glow au focus
- State-pill (badge arrondi ON/OFF)
- Welcome/empty states enrichis
- VERSION: 0.0.5 — alignement design system

# CHANGELOG — z-ha-buttons

## v0.0.3

- Reset factory complet (Dexie + localStorage + caches)

# CHANGELOG — z-ha-buttons

## v0.0.2

- Hamburger visible (fond bleu + bordure, 2.2rem)
- Menu Tools stable au hover (wrapper parent, submenu reste ouvert)
- Navigation humaine depuis le menu vers settings : ✅

## v0.0.1

- Initialisation du projet depuis PROMPT.md
- PWA Vue 3 mobile-first
- Stockage local Dexie (3 collections)
- Chiffrement AES-GCM pour token HA
- Communication HA via WebSocket API
- Navigation par vues (router)
- Import / export JSON
- Menus Help / About
- Support GitHub Pages
- Thème sombre profond (#0b1020 / #11192d)
- Déverrouillage avec master password
- Slider intensité / température pour lampes
- Ordre d'affichage personnalisable
- Icône PWA intégrée
- Tests Vitest (26/26)
- Tests connexion HA (HTTP + WebSocket)
- Tests E2E navigation humaine
- Scripts screenshots headless Playwright
