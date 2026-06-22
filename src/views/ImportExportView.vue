<script setup>
import { ref } from 'vue';
import { exportDatabaseCsv, importDatabaseCsv } from '../lib/store.js';

const fileInput = ref(null);
const status = ref('');
const error = ref('');

async function exportCsv() {
  const csv = await exportDatabaseCsv();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `z-ha-buttons-${new Date().toISOString().slice(0, 19)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  status.value = 'Export terminé';
}

async function onImport(event) {
  error.value = '';
  status.value = '';
  const file = event.target.files?.[0];
  if (!file) return;
  const proceed = window.confirm('L’import va réinitialiser la base. Continuer ?');
  if (!proceed) {
    status.value = 'Import annulé';
    event.target.value = '';
    return;
  }
  try {
    const text = await file.text();
    await importDatabaseCsv(text);
    status.value = 'Import terminé';
  } catch (err) {
    error.value = err?.message || 'Import impossible';
  } finally {
    event.target.value = '';
  }
}
</script>

<template>
  <section class="view-stack">
    <div class="panel">
      <h1>Export / import CSV</h1>
      <div class="actions">
        <button class="primary" type="button" @click="exportCsv">Exporter la base</button>
        <label class="ghost compact file-label">
          Importer un CSV
          <input ref="fileInput" type="file" accept=".csv,text/csv" @change="onImport" />
        </label>
      </div>
      <p v-if="status" class="success">{{ status }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </section>
</template>
