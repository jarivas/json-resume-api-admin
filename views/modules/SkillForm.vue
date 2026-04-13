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

    <h5 class="mt-3">{{ $t('form.keywords') }}</h5>
    <div v-for="(k, idx) in form.keywords" :key="idx" class="mb-2 border rounded p-2">
      <div class="mb-2">
        <label class="form-label">{{ $t('form.keywords') }} {{ idx + 1 }}</label>
        <input v-model="form.keywords[idx]" class="form-control" :disabled="busy" />
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" @click="removeKeyword(idx)">Remove</button>
      </div>
    </div>
    <div class="mb-3">
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addKeyword">Add keyword</button>
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
const form = ref({ name: '', keywords: [] })
const submitted = ref(false)
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val, keywords: Array.isArray(val.keywords) ? val.keywords.slice() : form.value.keywords }
      else form.value = { name: '', keywords: [] }
  },
  { immediate: true }
)

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (!form.value.name) return
  const payload = { ...form.value }
  payload.keywords = Array.isArray(payload.keywords)
    ? payload.keywords.map((s) => (s || '').toString().trim()).filter(Boolean)
    : []
  emit('submit', payload)
}

function addKeyword() {
  form.value.keywords.push('')
}

function removeKeyword(idx) {
  form.value.keywords.splice(idx, 1)
}
</script>
