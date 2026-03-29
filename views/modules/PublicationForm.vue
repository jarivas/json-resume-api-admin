<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label class="form-label">{{ $t('form.name') }}</label>
      <input v-model="form.name" class="form-control" required :disabled="busy" />
    </div>
    <button type="submit" class="btn btn-primary" :disabled="busy">{{ $t('form.save') }}</button>
    <button type="button" class="btn btn-secondary ms-2" @click="$emit('cancel')" :disabled="busy">
      {{ $t('form.cancel') }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: Object,
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])
const form = ref({ name: '' })
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...val }
    else form.value = { name: '' }
  },
  { immediate: true }
)

function onSubmit() {
  emit('submit', { ...form.value })
}
</script>
