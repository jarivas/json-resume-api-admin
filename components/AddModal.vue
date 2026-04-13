<template>
  <div
    v-if="show"
    class="modal-backdrop d-flex align-items-center justify-content-center"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1050"
  >
    <div class="card p-3 modal-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Añadir {{ addingModule }}</strong>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="card-body">
        <slot name="body">
          <!-- fallback simple form -->
          <div class="mb-2">
            <label class="form-label">Nombre</label>
            <input v-model="localState.name" class="form-control" />
          </div>
        </slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { toRaw } from 'vue'
const props = defineProps({
  show: Boolean,
  addingModule: { type: String, default: 'item' },
  value: Object,
})
const emits = defineEmits(['close', 'save'])

const localState = reactive({ ...(props.value || {}) })
watch(
  () => props.value,
  (v) => {
    Object.assign(localState, v || {})
  }
)

function onSave() {
  emits('save', toRaw(localState))
}
</script>

<style scoped>
.card {
  max-width: 95%;
}
.modal-card {
  width: 90%;
  max-width: 720px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.card-body {
  overflow: auto;
}
</style>
