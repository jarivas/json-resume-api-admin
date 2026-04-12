<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.name') }}</label>
      <input
        v-model="form.name"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.name }"
        placeholder="The World Wide Web"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.name" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.name') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.publisher') }}</label>
      <input
        v-model="form.publisher"
        class="form-control"
        placeholder="IEEE, Computer Magazine"
        :disabled="busy"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.releaseDate') }}</label>
      <input
        v-model="form.releaseDate"
        class="form-control"
        type="date"
        placeholder="YYYY-MM-DD or YYYY-MM"
        :disabled="busy"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.url') }}</label>
      <input
        v-model="form.url"
        class="form-control"
        type="url"
        placeholder="http://www.example.com/article"
        :disabled="busy"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.summary') }}</label>
      <textarea
        v-model="form.summary"
        class="form-control"
        placeholder="Short summary of publication"
        :disabled="busy"
      ></textarea>
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
const form = ref({ name: '', publisher: '', releaseDate: '', url: '', summary: '' })
const submitted = ref(false)
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else form.value = { name: '', publisher: '', releaseDate: '', url: '', summary: '' }
  },
  { immediate: true }
)

function onSubmit() {
  if (busy) return
  submitted.value = true
  if (!form.value.name) return
  emit('submit', { ...form.value })
}
</script>
