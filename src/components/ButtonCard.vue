<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { iconGlyph } from '../lib/icons.js';

const props = defineProps({
  button: { type: Object, required: true },
});

const emit = defineEmits(['toggle', 'detail']);
const holdTimer = ref(null);
const held = ref(false);

const statusClass = computed(() =>
  props.button.state === 'on' ? 'is-on' : props.button.state === 'off' ? 'is-off' : 'is-unknown',
);

function startHold() {
  held.value = false;
  clearTimeout(holdTimer.value);
  holdTimer.value = window.setTimeout(() => {
    held.value = true;
    if (props.button.kind === 'light') {
      emit('detail', props.button);
    }
  }, 520);
}

function endHold() {
  clearTimeout(holdTimer.value);
  if (!held.value) {
    emit('toggle', props.button);
  }
}

function cancelHold() {
  clearTimeout(holdTimer.value);
}

onBeforeUnmount(() => clearTimeout(holdTimer.value));
</script>

<template>
  <button
    class="button-card"
    :class="statusClass"
    :style="{ '--accent': button.color }"
    type="button"
    @pointerdown="startHold"
    @pointerup="endHold"
    @pointerleave="cancelHold"
    @pointercancel="cancelHold"
    @contextmenu.prevent
  >
    <span class="button-icon">{{ iconGlyph(button.icon) }}</span>
    <span class="button-label">{{ button.label }}</span>
    <span class="button-state">{{ button.state }}</span>
  </button>
</template>
