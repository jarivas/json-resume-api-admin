<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.title') }}</label>
      <input
        v-model="form.title"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.title }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.title" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.title') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.date') }}</label>
      <input
        v-model="form.date"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.date }"
        required
        type="date"
        :disabled="busy"
      />
      <div v-if="submitted && !form.date" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.date') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.awarder') }}</label>
      <input
        v-model="form.awarder"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.awarder }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.awarder" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.awarder') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.summary') }}</label>
      <textarea
        v-model="form.summary"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.summary }"
        required
        :disabled="busy"
      ></textarea>
      <div v-if="submitted && !form.summary" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.summary') }) }}
      </div>
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
const form = ref({ title: '', date: '', awarder: '', summary: '' })
const submitted = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else form.value = { title: '', date: '', awarder: '', summary: '' }
  },
  { immediate: true }
)

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (!form.value.title || !form.value.date || !form.value.awarder || !form.value.summary) {
    return
  }
  emit('submit', { ...form.value })
}
</script>
