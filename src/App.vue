<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { forceRefreshPwa } from './lib/pwa.js';
import { appState, lockApp, registerActivity, resetFactory, unlockApp } from './lib/store.js';

const router = useRouter();
const menuOpen = ref(false);
const unlockPassword = ref('');
const unlockError = ref('');
const unlockDialogOpen = ref(true);

const menuSections = [
  {
    items: [
      { to: '/buttons/new', label: 'Ajout d’un bouton' },
      { to: '/order', label: 'Ordre d’affichage des boutons' },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { to: '/settings', label: 'Configuration' },
      { to: '/sync', label: 'Exportation / importation CSV' },
      { action: forceRefreshPwa, label: 'Force refresh PWA' },
      { action: resetFactoryAndHome, label: 'Reset factory' },
    ],
  },
  {
    items: [
      { to: '/help', label: 'Help' },
      { to: '/about', label: 'About' },
    ],
  },
];

const title = computed(() => 'z-ha-buttons');

async function submitUnlock() {
  unlockError.value = '';
  try {
    await unlockApp(unlockPassword.value);
    unlockPassword.value = '';
    unlockDialogOpen.value = false;
  } catch (error) {
    unlockError.value = error?.message || 'Impossible de déverrouiller';
  }
}

function cancelUnlock() {
  unlockPassword.value = '';
  unlockError.value = '';
  unlockDialogOpen.value = false;
}

function openUnlockDialog() {
  unlockDialogOpen.value = true;
}

function closeMenu() {
  menuOpen.value = false;
}

async function resetFactoryAndHome() {
  if (!window.confirm('Réinitialiser complètement l’application ?')) {
    return;
  }
  await resetFactory();
  router.push('/');
}

async function activateMenuEntry(entry) {
  closeMenu();
  if (entry.action) {
    await entry.action();
  }
}

function gotoHome() {
  closeMenu();
  router.push('/');
}

const activity = () => registerActivity();

onMounted(() => {
  window.addEventListener('pointerdown', activity, { passive: true });
  window.addEventListener('keydown', activity);
});

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', activity);
  window.removeEventListener('keydown', activity);
});
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <button class="title" type="button" @click="gotoHome">{{ title }}</button>
      <div class="topbar-actions">
        <button
          v-if="appState.config"
          class="ghost compact"
          type="button"
          @click="appState.locked ? openUnlockDialog() : lockApp()"
        >
          {{ appState.locked ? 'Verrouillé' : 'Verrouiller' }}
        </button>
        <button class="ghost compact menu-btn" type="button" @click="menuOpen = !menuOpen">
          ☰
        </button>
      </div>
    </header>

    <main class="page">
      <RouterView />
    </main>

    <footer class="footer">
      <span>Version {{ appState.version }}</span>
      <span v-if="appState.info">{{ appState.info }}</span>
      <span v-else>{{ appState.locked ? 'Verrouillé' : 'Déverrouillé' }}</span>
    </footer>

    <div v-if="menuOpen" class="backdrop" @click.self="closeMenu">
      <nav class="menu-panel">
        <template v-for="section in menuSections" :key="section.heading || section.items[0].label">
          <div v-if="section.heading" class="menu-heading">{{ section.heading }}</div>
          <template v-for="entry in section.items" :key="entry.label">
            <RouterLink
              v-if="entry.to"
              :to="entry.to"
              class="menu-item menu-subitem"
              @click="closeMenu"
            >
              {{ entry.label }}
            </RouterLink>
            <button
              v-else
              class="menu-item menu-action menu-subitem"
              type="button"
              @click="activateMenuEntry(entry)"
            >
              {{ entry.label }}
            </button>
          </template>
        </template>
      </nav>
    </div>

    <div v-if="appState.config && appState.locked && unlockDialogOpen" class="backdrop lock-layer">
      <form class="panel lock-panel" autocomplete="off" @submit.prevent="submitUnlock">
        <h2>Déverrouillage</h2>
        <p>Entrez le mot de passe maître pour accéder au token Home Assistant.</p>
        <label>
          Mot de passe maître
          <input v-model="unlockPassword" type="password" autocomplete="current-password" />
        </label>
        <p v-if="unlockError" class="error">{{ unlockError }}</p>
        <div class="actions">
          <button class="primary" type="submit">Déverrouiller</button>
          <button class="ghost" type="button" @click="cancelUnlock">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>
