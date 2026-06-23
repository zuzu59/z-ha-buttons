<script setup>
import { computed } from 'vue';
import { appState, moveButton } from '../lib/store.js';

const buttons = computed(() => [...appState.buttons].sort((a, b) => a.order - b.order));

async function moveUp(id) {
  await moveButton(id, -1);
}

async function moveDown(id) {
  await moveButton(id, 1);
}
</script>

<template>
  <section class="view-stack">
    <div class="panel">
      <h1>Ordre d’affichage</h1>
      <p>Réorganise l’accueil avec les boutons haut / bas. Sauvegarde automatique.</p>
      <div class="order-list">
        <div v-for="button in buttons" :key="button.id" class="order-row">
          <div>
            <strong>{{ button.label }}</strong>
            <p>{{ button.entityId }}</p>
          </div>
          <div class="actions compact-actions">
            <button class="ghost compact" type="button" @click="moveUp(button.id)">↑</button>
            <button class="ghost compact" type="button" @click="moveDown(button.id)">↓</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
