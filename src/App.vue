<template>
  <div id="app" class="app">
    <!-- Topbar -->
    <header class="topbar">
      <router-link to="/" class="topbar-title">
        💡 z-ha-buttons
      </router-link>
      <div class="topbar-actions">
        <button
          v-if="lockMinutes > 0"
          class="btn-icon"
          @click="showLockModal = true"
          title="Verrouiller"
        >
          🔒
        </button>
        <button
          class="btn-icon hamburger"
          @click="showMenu = !showMenu"
          title="Menu"
        >
          ☰
        </button>
      </div>
    </header>

    <!-- Menu hamburger -->
    <nav v-if="showMenu" class="menu-overlay" @click="showMenu = false">
      <div class="menu" @click.stop>
        <router-link to="/buttons/new" @click="showMenu = false">
          ➕ Ajout d'un bouton
        </router-link>
        <router-link to="/order" @click="showMenu = false">
          📋 Ordre d'affichage
        </router-link>
        <div class="menu-group">
          <div class="menu-group-title" @mouseenter="toolsOpen = true" @mouseleave="toolsOpen = false" @focus="toolsOpen = true" @blur="toolsOpen = false">
            🔧 Tools ▾
          </div>
          <div v-if="toolsOpen" class="menu-sub">
            <router-link to="/settings" @click="showMenu = false">⚙️ Configuration</router-link>
            <router-link to="/sync" @click="showMenu = false">📁 Export / Import CSV</router-link>
            <button @click="forceRefreshPWA">🔄 Force refresh PWA</button>
            <button @click="confirmResetFactory">🗑️ Reset factory</button>
          </div>
        </div>
        <router-link to="/help" @click="showMenu = false">❓ Help</router-link>
        <router-link to="/about" @click="showMenu = false">ℹ️ About</router-link>
      </div>
    </nav>

    <!-- Router View -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>v{{ appVersion }}</span>
      <span class="footer-status">{{ statusText }}</span>
    </footer>

    <!-- Modal de déverrouillage -->
    <div v-if="showLockModal" class="modal-backdrop" @click.self="showLockModal = false">
      <div class="modal">
        <h3>🔒 Déverrouiller</h3>
        <p>Mot de passe maître :</p>
        <input
          v-model="unlockPassword"
          type="password"
          placeholder="Mot de passe"
          @keyup.enter="unlock"
          autofocus
        />
        <div class="modal-actions">
          <button @click="showLockModal = false">Annuler</button>
          <button class="btn-primary" @click="unlock">Déverrouiller</button>
        </div>
        <p v-if="unlockError" class="error-text">{{ unlockError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSetting } from './lib/db.js'

const appVersion = '1.0.0'
const showMenu = ref(false)
const toolsOpen = ref(false)
const showLockModal = ref(false)
const unlockPassword = ref('')
const unlockError = ref('')
const lockMinutes = ref(0)
const configLoaded = ref(false)

const statusText = computed(() => {
  if (!configLoaded.value) return 'Non configuré'
  return 'Prêt'
})

onMounted(async () => {
  const settings = await getSetting('ha-config')
  if (settings) {
    try {
      const config = JSON.parse(settings)
      lockMinutes.value = config.lockMinutes || 0
      configLoaded.value = true
    } catch {
      configLoaded.value = false
    }
  }
})

async function unlock() {
  try {
    const settings = await getSetting('ha-config')
    if (!settings) {
      unlockError.value = 'Aucune configuration trouvée'
      return
    }
    const config = JSON.parse(settings)
    if (config.masterPassword && unlockPassword.value === config.masterPassword) {
      showLockModal.value = false
      unlockPassword.value = ''
      unlockError.value = ''
    } else {
      unlockError.value = 'Mot de passe incorrect'
    }
  } catch (err) {
    unlockError.value = 'Erreur de déverrouillage'
  }
}

function forceRefreshPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => reg.unregister())
    })
  }
  // Nettoyer les caches
  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key))
    })
  }
  window.location.reload()
}

async function confirmResetFactory() {
  if (confirm('⚠️ Réinitialisation factory\n\nToutes les données seront supprimées. Continuer ?')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-primary: #0b1020;
  --bg-secondary: #11192d;
  --bg-card: #151f3d;
  --border-color: #1e2a4a;
  --text-primary: #e0e6f0;
  --text-secondary: #8892a8;
  --accent-blue: #4a9eff;
  --accent-violet: #8b5cf6;
  --gradient: linear-gradient(135deg, #4a9eff, #8b5cf6);
  --danger: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Topbar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.topbar-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.topbar-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Boutons */
.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: var(--bg-card);
}

.btn-primary {
  background: var(--gradient);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.btn-secondary:hover {
  border-color: var(--accent-blue);
}

.btn-danger {
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* Menu hamburger */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  justify-content: center;
  padding-top: 4rem;
}

.menu {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1rem;
  width: 90%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu a, .menu button {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border: none;
  background: none;
  text-align: left;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.menu a:hover, .menu button:hover {
  background: var(--bg-card);
}

.menu-group-title {
  cursor: pointer;
  font-weight: 500;
  color: var(--text-secondary);
}

.menu-sub {
  margin-left: 1rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  border-left: 2px solid var(--border-color);
  padding-left: 0.5rem;
}

.menu-sub a, .menu-sub button {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.modal h3 {
  margin-bottom: 1rem;
}

.modal p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.modal input {
  width: 100%;
  padding: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.error-text {
  color: var(--danger);
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

/* Cartes */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1rem;
  transition: transform 0.2s, border-color 0.2s;
}

.card:hover {
  border-color: var(--accent-blue);
}

/* Formulaire */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
}

/* Grille d'accueil */
.grid-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

/* Responsive */
@media (max-width: 600px) {
  .grid-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Utilitaires */
.text-center { text-align: center; }
.text-secondary { color: var(--text-secondary); }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.gap-1 { gap: 0.5rem; }
.gap-2 { gap: 1rem; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.w-full { width: 100%; }
</style>
