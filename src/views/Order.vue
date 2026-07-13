<template>
  <div class="order-page">
    <h2 class="mb-2">📋 Ordre d'affichage</h2>

    <div v-if="buttons.length === 0" class="card text-center">
      <p>Aucun bouton à ordonner</p>
      <router-link to="/buttons/new" class="btn-primary mt-2">
        ➕ Ajouter un bouton
      </router-link>
    </div>

    <div v-else class="order-list">
      <div
        v-for="(button, index) in buttons"
        :key="button.id"
        class="order-item"
      >
        <span class="order-index">{{ index + 1 }}</span>
        <span class="order-label">{{ button.label || button.entityId }}</span>
        <div class="order-actions">
          <button
            class="btn-icon"
            :disabled="index === 0"
            @click="moveUp(index)"
            title="Monter"
          >
            ↑
          </button>
          <button
            class="btn-icon"
            :disabled="index === buttons.length - 1"
            @click="moveDown(index)"
            title="Descendre"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getButtons, saveButtonOrder } from '../lib/db.js'

const buttons = ref([])

onMounted(async () => {
  await loadButtons()
})

async function loadButtons() {
  buttons.value = await getButtons()
}

async function moveUp(index) {
  if (index === 0) return
  const temp = buttons.value[index - 1]
  buttons.value[index - 1] = buttons.value[index]
  buttons.value[index] = temp
  await saveOrder()
}

async function moveDown(index) {
  if (index === buttons.value.length - 1) return
  const temp = buttons.value[index + 1]
  buttons.value[index + 1] = buttons.value[index]
  buttons.value[index] = temp
  await saveOrder()
}

async function saveOrder() {
  const ids = buttons.value.map(b => b.id)
  await saveButtonOrder(ids)
}
</script>

<style scoped>
.order-page {
  max-width: 600px;
  margin: 0 auto;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.order-index {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient);
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.85rem;
}

.order-label {
  flex: 1;
  font-weight: 500;
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.order-actions .btn-icon {
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
}

.order-actions .btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
