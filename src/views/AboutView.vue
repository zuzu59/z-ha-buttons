<script setup>
import { onMounted, ref } from 'vue';
import { compareVersions, decodeBase64Utf8, extractLatestChangelogVersion } from '../lib/changelog.js';
import { appState } from '../lib/store.js';

const repositoryUrl = 'https://github.com/zuzu59/z-ha-buttons';
const branchName = 'ver2';
const changelogUrl = `${repositoryUrl}/blob/${branchName}/CHANGELOG.md`;
const changelogApiUrl = `${repositoryUrl}/contents/CHANGELOG.md?ref=${branchName}`;

const changelog = ref(null);
const changelogState = ref('loading');
const changelogError = ref('');
const updateMessage = ref('');

async function loadChangelog() {
  changelogState.value = 'loading';
  changelogError.value = '';
  updateMessage.value = '';
  try {
    const response = await fetch(changelogApiUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    if (response.status === 404) {
      changelog.value = null;
      changelogState.value = 'none';
      return;
    }
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const data = await response.json();
    const markdown = decodeBase64Utf8(data.content || '');
    const latestVersion = extractLatestChangelogVersion(markdown);
    changelog.value = {
      latestVersion,
      url: data.html_url || changelogUrl,
    };
    changelogState.value = 'ready';
    if (latestVersion && compareVersions(appState.version, latestVersion) < 0) {
      updateMessage.value = `Nouvelle version disponible : ${latestVersion}`;
    }
  } catch (error) {
    changelogState.value = 'error';
    changelog.value = null;
    changelogError.value = error?.message || 'Impossible de vérifier le changelog';
  }
}

onMounted(loadChangelog);
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
            <h2>Changelog GitHub</h2>
            <p v-if="changelogState === 'loading'" class="muted">Vérification en cours…</p>
            <p v-else-if="changelog" class="muted">Dernière version publiée : {{ changelog.latestVersion }}</p>
            <p v-else-if="changelogState === 'none'" class="muted">Changelog indisponible pour le moment.</p>
            <p v-else class="error">{{ changelogError }}</p>
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
