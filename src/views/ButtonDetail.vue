<template>
  <div v-if="button" class="button-detail-page">
    <div class="detail-header">
      <h2>{{ button.icon || '💡' }} {{ button.label || button.entityId }}</h2>
      <router-link :to="`/buttons/${button.id}/edit`" class="btn-secondary">
        ✏️ Modifier
      </router-link>
    </div>

    <div class="card detail-card">
      <!-- Badge état -->
      <div class="state-badge">
        <span class="badge-icon">{{ button.icon || '💡' }}</span>
        <span class="badge-entity">{{ button.entityId }}</span>
        <span :class="['badge-state', button.state === 'on' ? 'on' : 'off']">
          {{ button.state === 'on' ? 'ON' : 'OFF' }}
        </span>
      </div>

      <!-- Contrôles pour les lampes -->
      <div v-if="button.kind === 'light'" class="light-controls">
        <!-- Slider intensité -->
        <div class="control-group">
          <label>💡 Intensité : {{ brightnessValue || 0 }}%</label>
          <input
            type="range"
            min="0"
            max="255"
            :value="brightnessValue"
            @input="updateBrightness"
            class="slider"
          />
          <button class="btn-primary" @click="applyBrightness" :disabled="applying">
            Appliquer
          </button>
        </div>

        <!-- Slider température -->
        <div class="control-group">
          <label>🌡️ Température : {{ colorTempValue || '--' }} K</label>
          <input
            type="range"
            min="2000"
            max="6500"
            step="100"
            :value="colorTempValue"
            @input="colorTempValue = $event.target.value"
            class="slider"
          />
          <button class="btn-primary" @click="applyColorTemp" :disabled="applying">
            Appliquer
          </button>
        </div>
      </div>

      <!-- Historique local -->
      <div class="history">
        <h3 class="mb-1">📜 Historique</h3>
        <div class="history-item">
          <span class="history-time">Créé :</span>
          <span class="history-value">{{ formatDate(button.createdAt) }}</span>
        </div>
        <div class="history-item">
          <span class="history-time">Modifié :</span>
          <span class="history-value">{{ formatDate(button.updatedAt) }}</span>
        </div>
        <div v-if="button.lastSyncedAt" class="history-item">
          <span class="history-time">Dernière sync :</span>
          <span class="history-value">{{ formatDate(button.lastSyncedAt) }}</span>
        </div>
      </div>
    </div>

    <div class="mt-2 text-center">
      <router-link to="/" class="btn-secondary">← Retour</router-link>
    </div>
  </div>

  <div v-else class="text-center">
    <div class="card">
      <p>Bouton introuvable</p>
      <router-link to="/" class="btn-secondary mt-2">← Retour</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getButton, updateButton } from '../lib/db.js'
import { refreshBrightnessAfterSet } from '../lib/homeAssistant.js'
import { getSetting } from '../lib/db.js'

const route = useRoute()
const button = ref(null)
const brightnessValue = ref(0)
const colorTempValue = ref(0)
const applying = ref(false)
const haConfig = ref(null)

onMounted(async () => {
  button.value = await getButton(route.params.id)
  if (button.value) {
    const settings = await getSetting('ha-config')
    if (settings) {
      haConfig.value = JSON.parse(settings)
    }
    if (button.value.kind === 'light' && button.value.attributes) {
      brightnessValue.value = button.value.attributes.brightness || 0
      colorTempValue.value = button.value.attributes.color_temp || 0
    }
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleString('fr-FR')
}

function updateBrightness(event) {
  brightnessValue.value = event.target.value
}

async function applyBrightness() {
  if (!haConfig.value || !button.value) return
  applying.value = true
  try {
    await refreshBrightnessAfterSet(
      haConfig.value,
      button.value.entityId,
      { brightness: parseInt(brightnessValue.value) }
    )
    const updated = await getButton(route.params.id)
    if (updated) {
      button.value = updated
      brightnessValue.value = updated.attributes?.brightness || 0
    }
  } catch (err) {
    console.error('Erreur luminosité:', err)
  } finally {
    applying.value = false
  }
}

async function applyColorTemp() {
  if (!haConfig.value || !button.value) return
  applying.value = true
  try {
    await refreshBrightnessAfterSet(
      haConfig.value,
      button.value.entityId,
      { color_temp: parseInt(colorTempValue.value) }
    )
    const updated = await getButton(route.params.id)
    if (updated) {
      button.value = updated
      colorTempValue.value = updated.attributes?.color_temp || 0
    }
  } catch (err) {
    console.error('Erreur température:', err)
  } finally {
    applying.value = false
  }
}
</script>

<style scoped>
.button-detail-page {
  max-width: 600px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-card {
  padding: 1.5rem;
}

.state-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.badge-icon {
  font-size: 1.5rem;
}

.badge-entity {
  color: var(--text-secondary);
  font-size: 0.85rem;
  flex: 1;
}

.badge-state {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.85rem;
}

.badge-state.on {
  background: rgba(34, 197, 94, 0.2);
  color: var(--success);
}

.badge-state.off {
  background: rgba(136, 146, 168, 0.2);
  color: var(--text-secondary);
}

.light-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.slider {
  width: 100%;
  accent-color: var(--accent-blue);
}

.control-group .btn-primary {
  align-self: flex-start;
  font-size: 0.85rem;
  padding: 0.35rem 1rem;
}

.history {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.85rem;
}

.history-time {
  color: var(--text-secondary);
}

.history-value {
  color: var(--text-primary);
}
</style>
