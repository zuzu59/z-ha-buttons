<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ICONS } from '../lib/icons.js';
import { appState, getButtonById, saveButton } from '../lib/store.js';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => Boolean(route.params.id));
const error = ref('');
const status = ref('');

const form = reactive({
  id: null,
  label: '',
  entityId: '',
  icon: 'bolt',
  color: '#38bdf8',
  kind: 'switch',
  createdAt: '',
  updatedAt: '',
  order: 0,
});

watchEffect(() => {
  if (isEdit.value) {
    const button = getButtonById(route.params.id);
    if (button) {
      form.id = button.id;
      form.label = button.label;
      form.entityId = button.entityId;
      form.icon = button.icon;
      form.color = button.color;
      form.kind = button.kind;
      form.createdAt = button.createdAt;
      form.updatedAt = button.updatedAt;
      form.order = button.order;
    }
  } else {
    form.id = null;
    form.label = '';
    form.entityId = '';
    form.icon = 'bolt';
    form.color = '#38bdf8';
    form.kind = 'switch';
    form.createdAt = '';
    form.updatedAt = '';
    form.order = 0;
  }
});

async function submit() {
  error.value = '';
  status.value = '';
  if (!form.entityId.trim()) {
    error.value = 'L’entité Home Assistant est requise';
    return;
  }
  const payload = {
    id: form.id,
    label: form.label.trim() || form.entityId.trim(),
    entityId: form.entityId.trim(),
    icon: form.icon,
    color: form.color,
    kind: form.entityId.startsWith('light.') ? 'light' : form.kind,
    createdAt: form.createdAt,
    order: form.order,
  };
  const saved = await saveButton(payload);
  status.value = 'Bouton enregistré';
  router.replace(`/buttons/${saved.id}`);
}
</script>

<template>
  <section class="view-stack">
    <div class="panel">
      <h1>{{ isEdit ? 'Modifier le bouton' : 'Ajouter un bouton' }}</h1>
      <form class="form-grid" autocomplete="off" @submit.prevent="submit">
        <label>
          Libellé
          <input v-model="form.label" type="text" placeholder="Salon" />
        </label>
        <label>
          Entité Home Assistant
          <input v-model="form.entityId" type="text" placeholder="light.salon" />
        </label>
        <label>
          Icône
          <select v-model="form.icon">
            <option v-for="icon in ICONS" :key="icon.value" :value="icon.value">{{ icon.label }}</option>
          </select>
        </label>
        <label>
          Couleur du cadre
          <input v-model="form.color" type="color" />
        </label>
        <label>
          Type
          <select v-model="form.kind">
            <option value="switch">Switch</option>
            <option value="light">Lampe</option>
          </select>
        </label>
        <label>
          Date de création
          <input :value="form.createdAt || 'Auto à l’enregistrement'" type="text" disabled />
        </label>
        <label>
          Date de modification
          <input :value="form.updatedAt || 'Auto à l’enregistrement'" type="text" disabled />
        </label>
        <div class="actions">
          <button class="primary" type="submit">Enregistrer</button>
          <RouterLink class="ghost link-like" to="/">Annuler</RouterLink>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="status" class="success">{{ status }}</p>
      </form>
    </div>

    <div v-if="appState.config" class="panel compact-panel">
      <h2>Conseil</h2>
      <p>Les lampes ouvrent un détail avancé en appui long depuis l’accueil.</p>
    </div>
  </section>
</template>
