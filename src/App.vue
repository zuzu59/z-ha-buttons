<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { appState, lockApp, registerActivity, unlockApp } from './lib/store.js';

const router = useRouter();
const menuOpen = ref(false);
const unlockPassword = ref('');
const unlockError = ref('');

const menuEntries = [
  { to: '/help', label: 'Help' },
  { to: '/order', label: 'Ordre d’affichage des boutons' },
  { to: '/buttons/new', label: 'Ajout d’un bouton' },
  { to: '/settings', label: 'Configuration' },
  { to: '/sync', label: 'Exportation / importation CSV' },
  { to: '/about', label: 'About' },
];

const title = computed(() => 'z-ha-buttons');

async function submitUnlock() {
  unlockError.value = '';
  try {
    await unlockApp(unlockPassword.value);
    unlockPassword.value = '';
  } catch (error) {
    unlockError.value = error?.message || 'Impossible de déverrouiller';
  }
}

function closeMenu() {
  menuOpen.value = false;
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
          @click="appState.locked ? null : lockApp()"
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
        <RouterLink
          v-for="entry in menuEntries"
          :key="entry.to"
          :to="entry.to"
          class="menu-item"
          @click="closeMenu"
        >
          {{ entry.label }}
        </RouterLink>
      </nav>
    </div>

    <div v-if="appState.config && appState.locked" class="backdrop lock-layer">
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
          <button class="ghost" type="button" @click="lockApp">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>
