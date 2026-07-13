---
name: z-ha-buttons
description: PWA mobile-first pour piloter Home Assistant avec élégance
colors:
  midnight-navy: "#0b1020"
  deep-space: "#11192d"
  night-velvet: "#151f3d"
  electric-blue: "#4a9eff"
  sapphire: "#8b5cf6"
  warm-ink: "#e0e6f0"
  dusk: "#8892a8"
  emerald: "#22c55e"
  crimson: "#ef4444"
  amber: "#f59e0b"
  gradient-primary: "linear-gradient(135deg, #4a9eff, #8b5cf6)"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.5
    fontWeight: 400
  heading:
    fontSize: "1rem"
    fontWeight: 600
  label:
    fontSize: "0.85rem"
    color: "#8892a8"
rounded:
  sm: "0.5rem"
  md: "1rem"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.gradient-primary}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1.5rem"
    fontSize: "1rem"
    fontWeight: 500
  button-secondary:
    backgroundColor: "{colors.night-velvet}"
    textColor: "{colors.warm-ink}"
    borderColor: "{colors.deep-space}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  button-card:
    backgroundColor: "{colors.night-velvet}"
    textColor: "{colors.warm-ink}"
    borderColor: "{colors.deep-space}"
    borderRadius: "{rounded.md}"
    padding: "1.5rem 1rem"
    fontSize: "0.9rem"
    fontWeight: 500
  card:
    backgroundColor: "{colors.night-velvet}"
    borderColor: "{colors.deep-space}"
    borderRadius: "{rounded.md}"
    padding: "1rem"
---

# Design System: z-ha-buttons

## 1. Overview

**Creative North Star: "The Intimate Salon"**

Imaginez un salon privé, tard le soir. Le velours sombre des murs absorbe le bruit du monde extérieur. Une seule lumière chaude émerge d'un lampadaire — elle guide, elle n'éclaire pas tout. Ici, chaque interaction est deliberate, tactile, satisfaisante. L'interface ne crie pas ; elle murmure.

Ce système rejette la surcharge, la technique froide, l'accumulation d'options. Il embrace le minimalisme chaleureux : peu d'éléments, chacun à sa place, chacun avec un purpose clair. La beauté réside dans l'espace vide autant que dans les éléments eux-mêmes.

**Key Characteristics:**
- Palette sombre et riche (bleu nuit profond)
- Accent électrique bleu-violet (rareté = impact)
- Typographie système, lisible, sans fioritures
- Coins arrondis (1rem) pour la douceur
- Glow lumineux comme indicateur de profondeur (pas d'ombres)
- Feedback tactile fort au tap (scale + transition)

## 2. Colors

**The Midnight Velvet Palette.** Trois tons de bleu nuit créent une hiérarchie de profondeur. L'électric bleu-violet apparaît en accent rare — sa disponibilité est sa puissance.

### Primary
- **Midnight Navy** (#0b1020): Surface principale. Fond de l'application, espace respiratoire.
- **Deep Space** (#11192d): Surface secondaire. Topbar, footer, overlay de menu.
- **Night Velvet** (#151f3d): Surface interactive. Cartes, boutons, inputs. Légèrement plus clair pour créer de la profondeur.

### Accent
- **Electric Blue** (#4a9eff): Action principale. Boutons CTA, hover actif, liens. Son rôle est d'attirer l'œil, pas de dominer.
- **Sapphire** (#8b5cf6): Complément à l'Electric Blue. Utilisé dans le gradient primary pour une transition douce.

**The Gradient Doctrine.** Le gradient `#4a9eff → #8b5cf6` n'est pas décoratif ; il est fonctionnel. Il indique "clic-moi" sans texte. Il apparaît sur les boutons primaires et le titre de la topbar.

### Neutral
- **Warm Ink** (#e0e6f0): Texte principal. Assez clair pour un contraste ≥4.5:1 sur Midnight Navy.
- **Dusk** (#8892a8): Texte secondaire, labels, états inactifs. Moins de poids visuel.

### Semantic
- **Emerald** (#22c55e): Succès, état ON. Utilisé avec modération.
- **Crimson** (#ef4444): Erreur, danger. N'apparaît qu'en cas de problème.
- **Amber** (#f59e0b): Avertissement. Rarement utilisé.

**The One Accent Rule.** L'Electric Blue apparaît sur ≤10% de la surface visible. Sa rareté est sa force.

## 3. Typography

**Character:** Système de police natif (San Francisco sur Apple, Segoe UI sur Windows, Roboto sur Android). Aucune police custom — la lisibilité prime sur le style.

### Hierarchy
- **Body** (1rem, 400, 1.5): Texte principal. Lisible, confortable sur mobile.
- **Heading** (1rem, 600): Titres de sections, labels forts.
- **Label** (0.85rem, 400, #8892a8): Sous-titres, hints, métadonnées.

**The System Font Rule.** Pas de Google Fonts, pas de chargement externe. La police du système est rapide, familière, et évolue avec le OS.

## 4. Elevation

**The Glow Philosophy.** Pas d'ombres portées classiques. La profondeur est créée par :
1. **Tonal layering** : 3 tons de bleu nuit (Midnight → Deep Space → Night Velvet)
2. **Luminescence** : Un glow subtil émerge des éléments interactifs au hover/active
3. **Border highlight** : Une bordure lumineuse (Electric Blue) indique l'élément actif

**Shadow Vocabulary:**
- **Ambient glow** (`box-shadow: 0 4px 20px rgba(74, 158, 255, 0.15)`): Apparaît au hover des button-cards. Diffus, chaleureux, pas technique.
- **Active glow** (`box-shadow: 0 0 15px rgba(34, 197, 94, 0.2)`): État ON d'un bouton. Lumière verte douce.

**The Flat-By-Default Rule.** Les surfaces sont plates au repos. La lumière n'apparaît qu'en réponse à l'interaction (hover, active, state change).

## 5. Components

### Button Card (Signature Component)
- **Shape:** Coins arrondis (1rem), padding généreux (1.5rem 1rem)
- **Default:** Background Night Velvet, border Deep Space
- **Hover:** BorderElectric Blue, ambient glow doux, légère élévation (translateY -2px)
- **Active:** Scale 0.97 (feedback tactile satisfaisant)
- **State ON:** BorderEmerald + glow vert doux (lumière qui "respire")
- **State OFF:** Border Deep Space, texte Dusk

### Primary Button
- **Shape:** Coins arrondis (0.5rem), padding 0.5rem 1.5rem
- **Background:** Gradient Electric Blue → Sapphire
- **Text:** Warm Ink
- **Hover:** Opacité 0.9
- **Disabled:** Opacité 0.5, cursor not-allowed

### Secondary Button
- **Background:** Night Velvet
- **Border:** 1px Deep Space
- **Hover:** BorderElectric Blue

### Card
- **Background:** Night Velvet
- **Border:** 1px Deep Space
- **BorderRadius:** 1rem
- **Padding:** 1rem
- **Hover:** BorderElectric Blue, légère élévation

### Inputs
- **Background:** Midnight Navy
- **Border:** 1px Deep Space
- **BorderRadius:** 0.5rem
- **Focus:** BorderElectric Blue, outline none
- **Text:** Warm Ink

### Navigation (Menu Hamburger)
- **Overlay:** Background rgba(0,0,0,0.5), backdrop-filter blur
- **Panel:** Background Deep Space, border Deep Space, borderRadius 1rem
- **Items:** Padding 0.75rem 1rem, hover background Night Velvet
- **Submenu:** Border-left 2px Deep Space, indent 1rem

### Modal
- **Backdrop:** Background rgba(0,0,0,0.7), z-index 300
- **Panel:** Background Deep Space, border Deep Space, borderRadius 1rem
- **MaxWidth:** 400px, padding 1.5rem

## 6. Do's and Don'ts

### Do:
- **Do** utiliser le glow comme indicateur d'interactivité (hover, active, state change)
- **Do** maintenir l'accent Electric Blue rare (≤10% de la surface)
- **Do** privilégier les coins arrondis (0.5rem à 1rem) pour la douceur
- **Do** utiliser le gradient primary uniquement sur les actions principales
- **Do** tester le contraste texte/fond (≥4.5:1 pour le body text)
- **Do** garder la typographie système (pas de Google Fonts)
- **Do** ajouter un feedback tactile fort au tap (scale + transition)

### Don't:
- **Don't** utiliser d'ombres portées classiques (utilisez le glow)
- **Don't** surcharger l'interface d'options (anti-reference de PRODUCT.md)
- **Don't** utiliser de gradient text (background-clip: text)
- **Don't** ajouter de bordures latérales colorées >1px sur les cartes
- **Don't** utiliser de glassmorphism décoratif (blur + transparence)
- **Don't** empiler les cartes les unes sur les autres (nested cards)
- **Don't** utiliser de texte en majuscules suivi de tracking large (eyebrow trope)
- **Don't** créer de grilles identiques de cartes sans variation
- **Don't** utiliser de nombres séquentiels comme scaffolding (01, 02, 03)
- **Don't** laisser le texte déborder du container (testez le responsive)
