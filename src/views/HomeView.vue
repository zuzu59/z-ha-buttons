<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ButtonCard from '../components/ButtonCard.vue';
import { appState, refreshRemoteStates, toggleButtonState } from '../lib/store.js';

const router = useRouter();
const buttons = computed(() => [...appState.buttons].sort((a, b) => a.order - b.order));

function openDetail(button) {
  router.push(`/buttons/${button.id}`);
}

onMounted(() => {
  refreshRemoteStates(true).catch(() => {
    // handled by store state/messages
  });
});
</script>

<template>
  <section class="view-stack">
    <div v-if="!appState.config" class="panel empty-state">
      <h1>Bienvenue</h1>
      <p>Configure Home Assistant pour commencer.</p>
      <RouterLink class="primary link-like" to="/settings">Configurer</RouterLink>
    </div>

    <div v-else class="grid-2">
      <ButtonCard
        v-for="button in buttons"
        :key="button.id"
        :button="button"
        @toggle="toggleButtonState"
        @detail="openDetail"
      />
    </div>

    <div v-if="appState.config && !buttons.length" class="panel empty-state">
      <h2>Aucun bouton</h2>
      <p>Ajoute ton premier bouton pour commencer.</p>
      <RouterLink class="primary link-like" to="/buttons/new">Ajouter un bouton</RouterLink>
    </div>
  </section>
</template>
