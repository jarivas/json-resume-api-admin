<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.name') }}</label>
      <input
        v-model="form.name"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.name }"
        placeholder="Facebook"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.name" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.name') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.position') }}</label>
      <input
        v-model="form.position"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.position }"
        placeholder="Software Engineer"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.position" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.position') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.location') }}</label>
      <input
        v-model="form.location"
        class="form-control"
        placeholder="Menlo Park, CA"
        :disabled="busy"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.description') }}</label>
      <input
        v-model="form.description"
        class="form-control"
        placeholder="Social Media Company"
        :disabled="busy"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.url') }}</label>
      <input
        v-model="form.url"
        class="form-control"
        type="url"
        placeholder="http://facebook.example.com"
        :disabled="busy"
      />
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('form.startDate') }}</label>
        <input
          v-model="form.startDate"
          class="form-control"
          type="date"
          placeholder="YYYY-MM-DD or YYYY-MM"
          :disabled="busy"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('form.endDate') }}</label>
        <input
          v-model="form.endDate"
          class="form-control"
          type="date"
          placeholder="YYYY-MM-DD or YYYY-MM"
          :disabled="busy"
        />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.summary') }}</label>
      <textarea
        v-model="form.summary"
        class="form-control"
        :disabled="busy"
        placeholder="Give an overview of your responsibilities at the company"
      ></textarea>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.highlights') }}</label>
      <textarea
        v-model="form.highlights"
        class="form-control"
        :disabled="busy"
        placeholder="Increased profits by 20% from 2011-2012 through viral advertising (one per line)"
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
const form = ref({
  name: '',
  position: '',
  location: '',
  description: '',
  url: '',
  startDate: '',
  endDate: '',
  summary: '',
  highlights: '',
})
const submitted = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else
      form.value = {
        name: '',
        position: '',
        location: '',
        description: '',
        url: '',
        startDate: '',
        endDate: '',
        summary: '',
        highlights: '',
      }
  },
  { immediate: true }
)

const busy = props.busy

function onSubmit() {
  if (busy) return
  submitted.value = true
  if (!form.value.name || !form.value.position) return
  // convert highlights textarea into array by lines before emitting
  const payload = { ...form.value }
  payload.highlights = payload.highlights
    ? payload.highlights
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  emit('submit', payload)
}
</script>
