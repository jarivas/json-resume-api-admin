<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.name') }}</label>
      <input
        v-model="form.name"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.name }"
        placeholder="Web Development"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.name" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.name') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.keywords') }}</label>
      <input
        v-model="form.keywords"
        class="form-control"
        placeholder="HTML, CSS, JavaScript (comma separated)"
        :disabled="busy"
      />
    </div>

    <button type="submit" class="btn btn-primary" :disabled="busy">{{ $t('form.save') }}</button>
    <button type="button" class="btn btn-secondary ms-2" @click="$emit('cancel')" :disabled="busy">
      {{ $t('form.cancel') }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ modelValue: Object, busy: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const form = ref({ name: '', keywords: '' })
const submitted = ref(false)
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else form.value = { name: '', keywords: '' }
  },
  { immediate: true }
)

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (!form.value.name) return
  const payload = { ...form.value }
  payload.keywords = payload.keywords
    ? payload.keywords
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  emit('submit', payload)
}
</script>
