<script setup>
import { reactive, ref, watchEffect } from 'vue';
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

watchEffect(() => {
  if (appState.config) {
    form.serverUrl = appState.config.serverUrl || '';
  }
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
    form.token = '';
    form.masterPassword = '';
    form.confirmPassword = '';
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
          <input v-model="form.token" type="password" placeholder="Long token" />
        </label>
        <label>
          Mot de passe maître
          <input v-model="form.masterPassword" type="password" autocomplete="new-password" />
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
