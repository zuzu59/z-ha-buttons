<template>
  <div class="about-page">
    <h2 class="mb-2">ℹ️ À propos</h2>

    <div class="card mb-2">
      <h3 class="mb-1">📱 Application</h3>
      <div class="info-row">
        <span>Version locale :</span>
        <span>{{ appVersion }}</span>
      </div>
      <div class="info-row">
        <span>Branche :</span>
        <span>{{ branchName }}</span>
      </div>
    </div>

    <div class="card mb-2">
      <h3 class="mb-1">🔗 Liens</h3>
      <a
        href="https://github.com/zuzu59/z-ha-buttons"
        target="_blank"
        rel="noopener"
        class="link"
      >
        📦 Code source (GitHub)
      </a>
    </div>

    <div class="card mb-2" v-if="changelogLoading">
      <p class="text-center text-secondary">Chargement du changelog...</p>
    </div>

    <div class="card mb-2" v-else>
      <h3 class="mb-1">📋 Changelog</h3>

      <p v-if="versionStatus" :class="versionStatus === 'new' ? 'new-version' : 'up-to-date'">
        {{ versionMessage }}
      </p>

      <pre class="changelog-content">{{ changelogText }}</pre>
    </div>

    <div class="text-center">
      <a
        href="https://github.com/zuzu59/z-ha-buttons/blob/ver2/CHANGELOG.md"
        target="_blank"
        rel="noopener"
        class="btn-secondary"
      >
        📄 Voir le changelog complet sur GitHub
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const appVersion = '1.0.0'
const branchName = 'ver2'
const changelogText = ref('')
const changelogLoading = ref(false)
const versionStatus = ref(null)
const versionMessage = ref('')

onMounted(async () => {
  await fetchChangelog()
})

async function fetchChangelog() {
  changelogLoading.value = true
  try {
    const resp = await fetch(
      'https://raw.githubusercontent.com/zuzu59/z-ha-buttons/ver2/CHANGELOG.md'
    )
    if (resp.ok) {
      changelogText.value = await resp.text()
      compareVersions()
    }
  } catch {
    changelogText.value = 'Impossible de charger le changelog (hors ligne ?)'
  } finally {
    changelogLoading.value = false
  }
}

function compareVersions() {
  // Extraire la dernière version du changelog
  const match = changelogText.value.match(/##\s*v?(\d+\.\d+\.\d+)/i)
  if (match) {
    const remoteVersion = match[1]
    const localVersion = appVersion

    if (compareSemver(remoteVersion, localVersion) > 0) {
      versionStatus.value = 'new'
      versionMessage.value = `🆕 Nouvelle version disponible : ${remoteVersion}`
    } else {
      versionStatus.value = 'up-to-date'
      versionMessage.value = '✅ Tu es à jour !'
    }
  }
}

function compareSemver(a, b) {
  const partsA = a.split('.').map(Number)
  const partsB = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if (partsA[i] > partsB[i]) return 1
    if (partsA[i] < partsB[i]) return -1
  }
  return 0
}
</script>

<style scoped>
.about-page {
  max-width: 600px;
  margin: 0 auto;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

.link {
  color: var(--accent-blue);
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
}

.link:hover {
  text-decoration: underline;
}

.changelog-content {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.new-version {
  color: var(--accent-blue);
  font-weight: 600;
  padding: 0.5rem;
  background: rgba(74, 158, 255, 0.1);
  border-radius: 0.5rem;
}

.up-to-date {
  color: var(--success);
  font-weight: 600;
  padding: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 0.5rem;
}
</style>
