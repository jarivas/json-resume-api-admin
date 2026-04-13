<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.language') }}</label>
      <template v-if="!isoOptions.length">
        <input
          v-model="form.language"
          class="form-control"
          :class="{ 'is-invalid': submitted && !form.language }"
          required
          :disabled="busy"
        />
      </template>
      <template v-else>
        <label class="form-label small">{{ $t('form.choose') || 'Choose language' }}</label>
        <select v-model="selectedIso" class="form-select">
          <option value="">-- {{ $t('form.select') || 'Select language' }} --</option>
          <option v-for="opt in isoOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
        </select>
      </template>
      <div v-if="submitted && !form.language" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.language') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.fluency') }}</label>
      <input v-model="form.fluency" class="form-control" :disabled="busy" />
    </div>

    <button type="submit" class="btn btn-primary" :disabled="busy">{{ $t('form.save') }}</button>
    <button type="button" class="btn btn-secondary ms-2" @click="$emit('cancel')" :disabled="busy">
      {{ $t('form.cancel') }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../../services/api'
const props = defineProps({ modelValue: Object, busy: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const form = ref({ language: '', fluency: '' })
const submitted = ref(false)
const isoOptions = ref([])
const selectedIso = ref('')

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.value = { ...form.value, ...val }
      selectedIso.value = val.language || ''
    } else form.value = { language: '', fluency: '' }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    const res = await api.get('/iso/language')
    isoOptions.value = (res.data || []).map((it) => ({ id: it.id, label: (it.name && (it.name.en || it.native_name || it.id)) || it.native_name || it.id }))
    // if editing and the form has a language code, try to select it
    if (form.value.language) {
      const found = isoOptions.value.find((o) => o.id === form.value.language)
      if (found) selectedIso.value = found.id
    }
  } catch (e) {
    // ignore errors; select will simply not show
  }
})

watch(selectedIso, (val) => {
  if (val) form.value.language = val
})

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (!form.value.language) return
  emit('submit', { ...form.value })
}
</script>
