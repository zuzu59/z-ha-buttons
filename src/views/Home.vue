<template>
  <div>
    <!-- Écran bienvenue -->
    <div v-if="!hasConfig" class="welcome">
      <div class="card text-center">
        <h2>👋 Bienvenue !</h2>
        <p class="mt-2 text-secondary">
          Configurez votre connexion Home Assistant pour commencer.
        </p>
        <router-link to="/settings" class="btn-primary mt-2">
          ⚙️ Configurer
        </router-link>
      </div>
    </div>

    <!-- Grille de boutons -->
    <div v-else class="buttons-grid">
      <template v-if="buttons.length > 0">
        <div
          v-for="button in orderedButtons"
          :key="button.id"
          class="button-card"
          :class="{ 'is-on': button.state === 'on' }"
          @click="handleTap(button)"
          @contextmenu.prevent="handleLongPress(button)"
        >
          <div class="button-icon">{{ button.icon || '💡' }}</div>
          <div class="button-label">{{ button.label || button.entityId }}</div>
          <div class="button-state">
            <span v-if="button.state === 'on'" class="state-on">● ON</span>
            <span v-else class="state-off">● OFF</span>
          </div>
        </div>
      </template>

      <div v-else class="card text-center empty-state">
        <p>Aucun bouton configuré</p>
        <router-link to="/buttons/new" class="btn-primary mt-2">
          ➕ Ajouter un bouton
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSetting, getButtons, syncButtonState } from '../lib/db.js'
import { fetchStates, callEntityToggle, refreshStateAfterAction } from '../lib/homeAssistant.js'

const hasConfig = ref(false)
const buttons = ref([])
const haConfig = ref(null)

onMounted(async () => {
  const settings = await getSetting('ha-config')
  if (settings) {
    try {
      haConfig.value = JSON.parse(settings)
      hasConfig.value = true
      await refreshButtons()
    } catch {
      hasConfig.value = false
    }
  }
})

async function refreshButtons() {
  const dbButtons = await getButtons()
  buttons.value = dbButtons

  if (haConfig.value) {
    try {
      const states = await fetchStates(haConfig.value)
      for (const button of buttons.value) {
        const haState = states.find(s => s.entity_id === button.entityId)
        if (haState) {
          await syncButtonState(
            button.id,
            haState.state,
            haState.attributes || {}
          )
        }
      }
      // Recharger après sync
      const updated = await getButtons()
      buttons.value = updated
    } catch {
      // Silencieux en cas d'erreur HA
    }
  }
}

function getOrderedButtons() {
  return buttons.value.sort((a, b) => {
    if (!a.order && !b.order) return 0
    if (!a.order) return 1
    if (!b.order) return -1
    return a.order - b.order
  })
}

const orderedButtons = getOrderedButtons()

async function handleTap(button) {
  if (!haConfig.value) return

  try {
    const currentState = button.state === 'on' ? 'off' : 'on'
    await callEntityToggle(haConfig.value, button.entityId, currentState)

    // Rafraîchir l'état après action
    const refreshed = await refreshStateAfterAction(haConfig.value, button.entityId)
    if (refreshed) {
      await syncButtonState(button.id, refreshed.state, refreshed.attributes || {})
      const updated = await getButtons()
      buttons.value = updated
    }
  } catch (err) {
    console.error('Erreur toggle:', err)
  }
}

function handleLongPress(button) {
  // Pour les lampes, ouvrir le détail
  if (button.kind === 'light') {
    window.location.href = `/buttons/${button.id}`
  }
}
</script>

<style scoped>
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.button-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.button-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-blue);
  box-shadow: 0 4px 20px rgba(74, 158, 255, 0.15);
}

.button-card:active {
  transform: scale(0.97);
}

.button-card.is-on {
  border-color: var(--success);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

.button-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.button-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.button-state {
  font-size: 0.8rem;
}

.state-on {
  color: var(--success);
  font-weight: 600;
}

.state-off {
  color: var(--text-secondary);
}

.empty-state {
  padding: 3rem 1rem;
  grid-column: 1 / -1;
}

@media (max-width: 600px) {
  .buttons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
