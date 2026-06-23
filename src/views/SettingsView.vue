<script setup>
import { reactive, ref, watchEffect } from 'vue';
import { bytesToUtf8 } from '../lib/crypto.js';
import { pingHomeAssistant } from '../lib/homeAssistant.js';
import { appState, saveConfiguration } from '../lib/store.js';

const form = reactive({
  serverUrl: '',
  token: '',
  masterPassword: '',
  confirmPassword: '',
});
const status = ref('');
const error = ref('');
const showToken = ref(false);
const showMasterPassword = ref(false);

watchEffect(() => {
  if (!appState.config) {
    return;
  }
  form.serverUrl = appState.config.serverUrl || '';
  form.masterPassword = appState.config.masterPassword || '';
  form.confirmPassword = appState.config.masterPassword || '';
  form.token = appState.config.unlockedTokenBytes
    ? bytesToUtf8(appState.config.unlockedTokenBytes)
    : form.token;
});

async function testConnection() {
  error.value = '';
  status.value = '';
  if (!form.serverUrl.trim() || !form.token.trim()) {
    error.value = 'URL et token requis';
    return;
  }
  try {
    const response = await pingHomeAssistant({
      serverUrl: form.serverUrl,
      token: form.token,
    });
    status.value = response.message || 'Connexion Home Assistant OK';
  } catch (cause) {
    error.value = cause?.message || 'Connexion Home Assistant impossible';
  }
}

async function submit() {
  error.value = '';
  status.value = '';
  if (!form.serverUrl.trim() || !form.token.trim()) {
    error.value = 'URL et token requis';
    return;
  }
  if (form.masterPassword.length < 8) {
    error.value = 'Le mot de passe maître doit contenir au moins 8 caractères';
    return;
  }
  if (form.masterPassword !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }
  try {
    await saveConfiguration({
      serverUrl: form.serverUrl,
      token: form.token,
      masterPassword: form.masterPassword,
    });
    status.value = 'Configuration enregistrée';
  } catch (cause) {
    error.value = cause?.message || 'Enregistrement impossible';
  }
}
</script>

<template>
  <section class="view-stack">
    <div class="panel">
      <h1>Configuration</h1>
      <p>Renseigne le serveur Home Assistant et le token API.</p>
      <form class="form-grid" autocomplete="off" @submit.prevent="submit">
        <label>
          Adresse du serveur
          <input v-model="form.serverUrl" type="url" placeholder="https://home.example.com" />
        </label>
        <label>
          Token Home Assistant
          <div class="field-with-action">
            <input
              v-model="form.token"
              :type="showToken ? 'text' : 'password'"
              placeholder="Long token"
            />
            <button
              class="ghost compact icon-toggle"
              type="button"
              :aria-label="showToken ? 'Masquer le token' : 'Afficher le token'"
              @click="showToken = !showToken"
            >
              {{ showToken ? '🙈' : '👁' }}
            </button>
          </div>
        </label>
        <label>
          Mot de passe maître
          <div class="field-with-action">
            <input
              v-model="form.masterPassword"
              :type="showMasterPassword ? 'text' : 'password'"
              autocomplete="new-password"
            />
            <button
              class="ghost compact icon-toggle"
              type="button"
              :aria-label="showMasterPassword ? 'Masquer le mot de passe maître' : 'Afficher le mot de passe maître'"
              @click="showMasterPassword = !showMasterPassword"
            >
              {{ showMasterPassword ? '🙈' : '👁' }}
            </button>
          </div>
        </label>
        <label>
          Confirmation du mot de passe
          <input v-model="form.confirmPassword" type="password" autocomplete="new-password" />
        </label>
        <div class="actions">
          <button class="primary" type="button" @click="testConnection">Tester la connexion</button>
          <button class="primary" type="submit">Enregistrer</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="status" class="success">{{ status }}</p>
      </form>
    </div>

    <div v-if="appState.config" class="panel compact-panel">
      <h2>Résumé</h2>
      <p>{{ appState.config.serverUrl }}</p>
      <p v-if="appState.config.homeAssistantName">Maison : {{ appState.config.homeAssistantName }}</p>
      <p>{{ appState.locked ? 'Application verrouillée' : 'Application déverrouillée' }}</p>
    </div>
  </section>
</template>
