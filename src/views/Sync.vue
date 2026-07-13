<template>
  <div class="sync-page">
    <h2 class="mb-2">📁 Export / Import CSV</h2>

    <div class="card">
      <h3 class="mb-1">📤 Exporter</h3>
      <p class="text-secondary mb-2">
        Exporter toutes les données de l'application en JSON.
      </p>
      <button class="btn-primary" @click="exportData">
        📤 Exporter
      </button>

      <hr class="divider" />

      <h3 class="mb-1">📥 Importer</h3>
      <p class="text-secondary mb-2">
        Importer des données depuis un fichier JSON. <strong>Attention :</strong>
        cela réinitialisera toutes les données actuelles.
      </p>
      <input
        type="file"
        ref="fileInput"
        accept=".json"
        @change="handleFileImport"
        style="display: none"
      />
      <button class="btn-secondary" @click="$refs.fileInput.click()">
        📥 Importer un fichier
      </button>

      <p v-if="importMessage" :class="importMessageType === 'error' ? 'error-text' : 'success-text'">
        {{ importMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportDB, importDB } from '../lib/db.js'

const fileInput = ref(null)
const importMessage = ref('')
const importMessageType = ref('')

async function exportData() {
  try {
    const data = await exportDB()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `z-ha-buttons-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    alert('Erreur lors de l\'export')
  }
}

async function handleFileImport(event) {
  const file = event.target.files[0]
  if (!file) return

  importMessage.value = ''

  try {
    const text = await file.text()
    const data = JSON.parse(text)
    await importDB(data)
    importMessage.value = '✅ Import réussi ! La page va recharger...'
    setTimeout(() => window.location.reload(), 1500)
  } catch (err) {
    importMessage.value = `❌ Erreur: ${err.message}`
    importMessageType.value = 'error'
  }
}
</script>

<style scoped>
.sync-page {
  max-width: 600px;
  margin: 0 auto;
}

.divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1.5rem 0;
}

h3 {
  font-size: 1rem;
}
</style>
