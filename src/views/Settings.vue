<template>
  <div class="settings-page">
    <h2 class="mb-2">⚙️ Configuration Home Assistant</h2>

    <div class="card">
      <form @submit.prevent="saveConfig">
        <div class="form-group">
          <label for="serverUrl">🌐 URL du serveur</label>
          <input
            id="serverUrl"
            v-model="form.serverUrl"
            type="url"
            placeholder="https://your-home-assistant.local:8123"
            required
          />
        </div>

        <div class="form-group">
          <label for="haName">🏠 Nom Home Assistant</label>
          <input
            id="haName"
            v-model="form.homeAssistantName"
            type="text"
            placeholder="Mon Home Assistant"
          />
        </div>

        <div class="form-group">
          <label for="token">🔑 Token Home Assistant</label>
          <div class="input-with-toggle">
            <input
              id="token"
              v-model="form.tokenSecret"
              :type="showToken ? 'text' : 'password'"
              placeholder="eyJ..."
              required
            />
            <button
              type="button"
              class="btn-toggle"
              @click="showToken = !showToken"
            >
              {{ showToken ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="masterPassword">🔐 Mot de passe maître</label>
          <div class="input-with-toggle">
            <input
              id="masterPassword"
              v-model="form.masterPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mot de passe pour déverrouiller"
            />
            <button
              type="button"
              class="btn-toggle"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">✅ Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmer"
          />
        </div>

        <div class="form-group">
          <label for="lockMinutes">⏱️ Verrouillage (minutes, 0 = désactivé)</label>
          <input
            id="lockMinutes"
            v-model.number="form.lockMinutes"
            type="number"
            min="0"
            step="1"
          />
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn-secondary"
            @click="testConnection"
            :disabled="testing"
          >
            {{ testing ? '⏳ Test...' : '🔌 Tester la connexion' }}
          </button>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? '💾 Enregistrement...' : '💾 Enregistrer' }}
          </button>
        </div>

        <p v-if="message" :class="messageType === 'error' ? 'error-text' : 'success-text'">
          {{ message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSetting, saveSetting } from '../lib/db.js'
import { pingHomeAssistant } from '../lib/homeAssistant.js'

const form = ref({
  serverUrl: '',
  homeAssistantName: '',
  tokenSecret: '',
  masterPassword: '',
  lockMinutes: 0
})

const confirmPassword = ref('')
const showToken = ref(false)
const showPassword = ref(false)
const testing = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref('')

onMounted(async () => {
  const settings = await getSetting('ha-config')
  if (settings) {
    try {
      const saved = JSON.parse(settings)
      form.value = {
        serverUrl: saved.serverUrl || '',
        homeAssistantName: saved.homeAssistantName || '',
        tokenSecret: saved.tokenSecret || '',
        masterPassword: saved.masterPassword || '',
        lockMinutes: saved.lockMinutes || 0
      }
    } catch {}
  }
})

async function testConnection() {
  if (!form.value.serverUrl || !form.value.tokenSecret) {
    showMessage('Remplissez l\'URL et le token', 'error')
    return
  }

  testing.value = true
  try {
    const config = {
      serverUrl: form.value.serverUrl,
      tokenSecret: form.value.tokenSecret
    }
    await pingHomeAssistant(config)
    showMessage('✅ Connexion réussie !', 'success')
  } catch (err) {
    showMessage(`❌ Échec: ${err.message}`, 'error')
  } finally {
    testing.value = false
  }
}

async function saveConfig() {
  if (form.value.masterPassword && form.value.masterPassword !== confirmPassword.value) {
    showMessage('Les mots de passe ne correspondent pas', 'error')
    return
  }

  saving.value = true
  message.value = ''

  try {
    const config = {
      serverUrl: form.value.serverUrl,
      homeAssistantName: form.value.homeAssistantName,
      tokenSecret: form.value.tokenSecret,
      masterPassword: form.value.masterPassword || null,
      lockMinutes: form.value.lockMinutes || 0,
      updatedAt: new Date().toISOString()
    }

    await saveSetting('ha-config', config)
    showMessage('✅ Configuration enregistrée !', 'success')
  } catch (err) {
    showMessage(`❌ Erreur: ${err.message}`, 'error')
  } finally {
    saving.value = false
  }
}

function showMessage(msg, type) {
  message.value = msg
  messageType.value = type
}
</script>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
}

.input-with-toggle {
  display: flex;
  gap: 0.5rem;
}

.input-with-toggle input {
  flex: 1;
}

.btn-toggle {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.success-text {
  color: var(--success);
  margin-top: 1rem;
}
</style>
