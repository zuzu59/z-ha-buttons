<script setup>
import { onMounted, ref } from 'vue';
import { appState } from '../lib/store.js';

const repositoryUrl = 'https://github.com/zuzu59/z-ha-buttons';
const branchName = 'ver2';
const changelogUrl = `${repositoryUrl}/blob/${branchName}/CHANGELOG.md`;

const release = ref(null);
const releaseState = ref('loading');
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
  releaseState.value = 'loading';
  releaseError.value = '';
  updateMessage.value = '';
  try {
    const response = await fetch('https://api.github.com/repos/zuzu59/z-ha-buttons/releases/latest', {
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    if (response.status === 404) {
      release.value = null;
      releaseState.value = 'none';
      return;
    }
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const data = await response.json();
    release.value = data;
    releaseState.value = 'ready';
    if (compareVersions(appState.version, data.tag_name || '') > 0) {
      updateMessage.value = 'Nouvelle version disponible';
    }
  } catch (error) {
    releaseState.value = 'error';
    release.value = null;
    releaseError.value = error?.message || 'Impossible de vérifier les releases';
  }
}

onMounted(loadRelease);
</script>

<template>
  <section class="view-stack about-view">
    <div class="panel about-hero">
      <div class="eyebrow">Projet</div>
      <h1>About</h1>
      <p class="about-lead">
        z-ha-buttons pilote tes entités Home Assistant depuis une PWA locale,
        légère et pensée pour l’usage mobile.
      </p>
      <div class="about-meta">
        <span class="pill">Version {{ appState.version }}</span>
        <span class="pill">Branche {{ branchName }}</span>
      </div>
    </div>

    <div class="about-grid">
      <div class="panel about-card">
        <div class="eyebrow">Ressources</div>
        <div class="about-links">
          <a class="about-link" :href="repositoryUrl" target="_blank" rel="noreferrer">
            <span class="about-link-title">Dépôt GitHub</span>
            <span class="about-link-hint">Code source et historique</span>
          </a>
          <a class="about-link" :href="changelogUrl" target="_blank" rel="noreferrer">
            <span class="about-link-title">Changelog</span>
            <span class="about-link-hint">Historique détaillé de la version courante</span>
          </a>
          <a class="about-link" href="https://github.com/zuzu59" target="_blank" rel="noreferrer">
            <span class="about-link-title">GitHub.com/zuzu59</span>
            <span class="about-link-hint">Profil GitHub de référence</span>
          </a>
        </div>
      </div>

      <div class="panel about-card">
        <div class="eyebrow">Publication</div>
        <div class="release-card">
          <div>
            <h2>Dernière release</h2>
            <p v-if="releaseState === 'loading'" class="muted">Vérification en cours…</p>
            <p v-else-if="release" class="muted">{{ release.tag_name }}</p>
            <p v-else-if="releaseState === 'none'" class="muted">Aucune release publiée pour le moment.</p>
            <p v-else class="error">{{ releaseError }}</p>
          </div>
          <p v-if="updateMessage" class="success">{{ updateMessage }}</p>
          <a class="about-link about-link-inline" :href="changelogUrl" target="_blank" rel="noreferrer">
            <span class="about-link-title">Version {{ appState.version }}</span>
            <span class="about-link-hint">Consulter le changelog associé</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
