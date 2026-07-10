<script setup>
import { onMounted, ref } from 'vue';
import { appState } from '../lib/store.js';

const release = ref(null);
const releaseError = ref('');
const updateMessage = ref('');

function compareVersions(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number);
  const pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    const delta = (pb[index] || 0) - (pa[index] || 0);
    if (delta !== 0) return delta;
  }
  return 0;
}

async function loadRelease() {
  try {
    const response = await fetch('https://api.github.com/repos/zuzu59/z-ha-buttons/releases/latest', {
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const data = await response.json();
    release.value = data;
    if (compareVersions(appState.version, data.tag_name || '') > 0) {
      updateMessage.value = 'Nouvelle version disponible';
    }
  } catch (error) {
    releaseError.value = error?.message || 'Impossible de vérifier les releases';
  }
}

onMounted(loadRelease);
</script>

<template>
  <section class="view-stack">
    <div class="panel">
      <h1>About</h1>
      <div class="stack">
        <a class="compact-link" href="https://github.com/zuzu59" target="_blank" rel="noreferrer">GitHub.com/zuzu59</a>
        <a class="compact-link" href="https://github.com/zuzu59/z-ha-buttons" target="_blank" rel="noreferrer">Dépôt GitHub</a>
        <a class="compact-link" href="https://github.com/zuzu59/z-ha-buttons/blob/ver2/CHANGELOG.md" target="_blank" rel="noreferrer">Changelog</a>
        <a class="compact-link" href="https://github.com/zuzu59/z-ha-buttons/blob/ver2/CHANGELOG.md" target="_blank" rel="noreferrer">Version {{ appState.version }}</a>
      </div>
      <p v-if="updateMessage" class="success">{{ updateMessage }}</p>
      <p v-if="release" class="muted">Dernière release : {{ release.tag_name }}</p>
      <p v-if="releaseError" class="error">{{ releaseError }}</p>
    </div>
  </section>
</template>
