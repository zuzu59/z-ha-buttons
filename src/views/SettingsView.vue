<script setup>
import { reactive, ref, watchEffect } from 'vue';
import { appState, saveConfiguration } from '../lib/store.js';

const form = reactive({
  serverUrl: '',
  token: '',
  masterPassword: '',
  confirmPassword: '',
  lockMinutes: 15,
});
const status = ref('');
const error = ref('');

watchEffect(() => {
  if (appState.config) {
    form.serverUrl = appState.config.serverUrl || '';
    form.lockMinutes = appState.config.lockMinutes || 15;
  }
});

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
  await saveConfiguration({
    serverUrl: form.serverUrl,
    token: form.token,
    masterPassword: form.masterPassword,
    lockMinutes: form.lockMinutes,
  });
  form.token = '';
  form.masterPassword = '';
  form.confirmPassword = '';
  status.value = 'Configuration enregistrée';
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
        <label>
          Verrouillage auto (minutes)
          <input v-model.number="form.lockMinutes" type="number" min="1" max="180" />
        </label>
        <div class="actions">
          <button class="primary" type="submit">Enregistrer</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="status" class="success">{{ status }}</p>
      </form>
    </div>

    <div v-if="appState.config" class="panel compact-panel">
      <h2>Résumé</h2>
      <p>{{ appState.config.serverUrl }}</p>
      <p>Verrouillage auto : {{ appState.config.lockMinutes }} min</p>
      <p>{{ appState.locked ? 'Application verrouillée' : 'Application déverrouillée' }}</p>
    </div>
  </section>
</template>
