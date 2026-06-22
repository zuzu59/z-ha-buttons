<script setup>
import { computed } from 'vue';
import { appState, moveButton } from '../lib/store.js';

const buttons = computed(() => [...appState.buttons].sort((a, b) => a.order - b.order));
</script>

<template>
  <section class="view-stack">
    <div class="panel">
      <h1>Ordre d’affichage</h1>
      <p>Réorganise l’accueil avec les boutons haut / bas.</p>
      <div class="order-list">
        <div v-for="button in buttons" :key="button.id" class="order-row">
          <div>
            <strong>{{ button.label }}</strong>
            <p>{{ button.entityId }}</p>
          </div>
          <div class="actions compact-actions">
            <button class="ghost compact" type="button" @click="moveButton(button.id, -1)">↑</button>
            <button class="ghost compact" type="button" @click="moveButton(button.id, 1)">↓</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
