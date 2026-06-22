<script setup>
import { computed, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { setLightState, getButtonById } from '../lib/store.js';
import { iconGlyph } from '../lib/icons.js';

const route = useRoute();
const router = useRouter();
const form = reactive({
  brightness: 100,
  temperature: 3500,
});

const button = computed(() => getButtonById(route.params.id));

watchEffect(() => {
  if (button.value?.attributes) {
    const attrs = button.value.attributes;
    form.brightness = Math.round(((attrs.brightness || 255) / 255) * 100);
    form.temperature = attrs.color_temp_kelvin || attrs.color_temp || 3500;
  }
});

async function applyBrightness() {
  await setLightState(button.value.id, {
    brightness_pct: Number(form.brightness),
  });
}

async function applyTemperature() {
  await setLightState(button.value.id, {
    color_temp_kelvin: Number(form.temperature),
  });
}
</script>

<template>
  <section v-if="button" class="view-stack">
    <div class="panel detail-panel">
      <div class="detail-header">
        <div>
          <p class="eyebrow">Détail lampe</p>
          <h1>{{ button.label }}</h1>
        </div>
        <RouterLink class="ghost compact" :to="`/buttons/${button.id}/edit`">Modifier</RouterLink>
      </div>

      <div class="detail-badge" :style="{ '--accent': button.color }">
        <span>{{ iconGlyph(button.icon) }}</span>
        <strong>{{ button.entityId }}</strong>
        <span>{{ button.state }}</span>
      </div>

      <div class="form-grid">
        <label>
          Intensité : {{ form.brightness }}%
          <input v-model="form.brightness" type="range" min="1" max="100" />
        </label>
        <button class="primary" type="button" @click="applyBrightness">Appliquer l’intensité</button>

        <label>
          Température : {{ form.temperature }} K
          <input v-model="form.temperature" type="range" min="2000" max="6500" step="50" />
        </label>
        <button class="primary" type="button" @click="applyTemperature">Appliquer la température</button>
      </div>
    </div>

    <div class="panel compact-panel">
      <h2>Historique local</h2>
      <p>Créé le {{ button.createdAt }}</p>
      <p>Modifié le {{ button.updatedAt }}</p>
      <button class="ghost compact" type="button" @click="router.push('/')">Retour</button>
    </div>
  </section>

  <section v-else class="panel empty-state">
    <h1>Bouton introuvable</h1>
    <RouterLink class="primary link-like" to="/">Retour à l’accueil</RouterLink>
  </section>
</template>
