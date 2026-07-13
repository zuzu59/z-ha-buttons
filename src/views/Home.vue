<template>
  <div>
    <!-- Écran bienvenue -->
    <div v-if="!hasConfig" class="welcome">
      <div class="card text-center welcome-card">
        <div class="welcome-icon">👋</div>
        <h2 class="welcome-title">Bienvenue !</h2>
        <p class="welcome-text">
          Configurez votre connexion Home Assistant pour commencer.
        </p>
        <router-link to="/settings" class="btn-primary btn-lg mt-2">
          ⚙️ Configurer
        </router-link>
      </div>
    </div>

    <!-- Grille de boutons -->
    <div v-else class="buttons-grid">
      <template v-if="buttons.length > 0">
        <button
          v-for="button in orderedButtons"
          :key="button.id"
          type="button"
          class="button-card"
          :class="{ 'is-on': button.state === 'on' }"
          @click="handleTap(button)"
          @contextmenu.prevent="handleLongPress(button)"
          :aria-label="`${button.label || button.entityId}, ${button.state === 'on' ? 'activé' : 'désactivé'}`"
        >
          <div class="button-icon">{{ button.icon || '💡' }}</div>
          <div class="button-label">{{ button.label || button.entityId }}</div>
          <div class="button-state">
            <span v-if="button.state === 'on'" class="state-pill state-on">Activé</span>
            <span v-else class="state-pill state-off">Désactivé</span>
          </div>
        </button>
      </template>

      <div v-else class="card text-center empty-state">
        <div class="empty-icon">💡</div>
        <p class="empty-title">Aucun bouton configuré</p>
        <p class="empty-text">Ajoutez votre premier bouton pour contrôler vos appareils.</p>
        <router-link to="/buttons/new" class="btn-primary mt-2">
          ➕ Ajouter un bouton
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSetting, getButtons, syncButtonState } from '../lib/db.js'
import { fetchStates, callEntityToggle, refreshStateAfterAction } from '../lib/homeAssistant.js'

const hasConfig = ref(false)
const buttons = ref([])
const haConfig = ref(null)

const orderedButtons = computed(() => {
  return buttons.value.sort((a, b) => {
    if (!a.order && !b.order) return 0
    if (!a.order) return 1
    if (!b.order) return -1
    return a.order - b.order
  })
})

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
  padding: 2rem 1rem;
}

.welcome-card {
  max-width: 400px;
  padding: 2.5rem 2rem;
}

.welcome-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.welcome-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.btn-lg {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
}

.button-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.button-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-blue);
  box-shadow: 0 4px 20px rgba(74, 158, 255, 0.15);
}

.button-card:active {
  transform: scale(0.97);
  transition-duration: 0.1s;
}

.button-card.is-on {
  border-color: var(--success);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

.button-card.is-on:hover {
  border-color: var(--success);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.button-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.button-label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-primary);
  word-break: break-word;
}

.button-state {
  margin-top: auto;
}

.state-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.state-on {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}

.state-off {
  background: rgba(136, 146, 168, 0.15);
  color: var(--text-secondary);
}

.empty-state {
  padding: 3rem 1rem;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .buttons-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .button-card {
    padding: 1.25rem 0.75rem;
  }

  .button-icon {
    font-size: 2rem;
  }
}
</style>
