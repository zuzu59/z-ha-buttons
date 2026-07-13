<template>
  <div class="button-form-page">
    <h2 class="mb-2">
      {{ isEdit ? '✏️ Modifier le bouton' : '➕ Nouveau bouton' }}
    </h2>

    <div class="card">
      <form @submit.prevent="saveButton">
        <div class="form-group">
          <label for="label">📝 Libellé</label>
          <input
            id="label"
            v-model="form.label"
            type="text"
            placeholder="Nom visible"
            required
          />
        </div>

        <div class="form-group">
          <label for="entityId">🔗 Entité Home Assistant</label>
          <input
            id="entityId"
            v-model="form.entityId"
            type="text"
            placeholder="light Salon"
            required
          />
        </div>

        <div class="form-group">
          <label for="icon">🎨 Icône</label>
          <input
            id="icon"
            v-model="form.icon"
            type="text"
            placeholder="💡"
          />
        </div>

        <div class="form-group">
          <label for="color">🎨 Couleur</label>
          <input
            id="color"
            v-model="form.color"
            type="color"
            value="#4a9eff"
          />
        </div>

        <div class="form-group">
          <label for="kind">🔌 Type</label>
          <select id="kind" v-model="form.kind">
            <option value="switch">Switch</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div class="form-actions">
          <router-link to="/" class="btn-secondary">Annuler</router-link>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? '💾...' : '💾 Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getButton, addButton, updateButton } from '../lib/db.js'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  label: '',
  entityId: '',
  icon: '💡',
  color: '#4a9eff',
  kind: 'switch',
  order: 0
})

const saving = ref(false)

// Auto-déterminer le kind quand on tape une entité light
watch(form, (newForm) => {
  if (newForm.entityId && newForm.entityId.startsWith('light.') && newForm.entityId.includes('.')) {
    form.value.kind = 'light'
  }
}, { deep: true })

onMounted(async () => {
  if (isEdit.value) {
    const button = await getButton(route.params.id)
    if (button) {
      form.value = {
        label: button.label || '',
        entityId: button.entityId || '',
        icon: button.icon || '💡',
        color: button.color || '#4a9eff',
        kind: button.kind || 'switch',
        order: button.order || 0
      }
    }
  }
})

async function saveButton() {
  // Vérifier que c'est une entité valide
  if (!form.value.entityId.includes('.')) {
    alert('L\'entité doit être au format "domain.name" (ex: light.salon)')
    return
  }

  // Déterminer le kind
  if (form.value.entityId.startsWith('light.')) {
    form.value.kind = 'light'
  }

  saving.value = true

  try {
    if (isEdit.value) {
      await updateButton(route.params.id, {
        label: form.value.label,
        entityId: form.value.entityId,
        icon: form.value.icon,
        color: form.value.color,
        kind: form.value.kind,
        order: form.value.order
      })
    } else {
      const id = await addButton({
        label: form.value.label,
        entityId: form.value.entityId,
        icon: form.value.icon,
        color: form.value.color,
        kind: form.value.kind,
        order: form.value.order || 0
      })
      router.push(`/buttons/${id}`)
      return
    }
    router.push('/')
  } catch (err) {
    console.error('Erreur sauvegarde:', err)
    alert('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.button-form-page {
  max-width: 600px;
  margin: 0 auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
