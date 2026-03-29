<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.organization') }}</label>
      <input
        v-model="form.organization"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.organization }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.organization" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.organization') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.position') }}</label>
      <input
        v-model="form.position"
        class="form-control"
        :class="{ 'is-invalid': submitted && !form.position }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.position" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.position') }) }}
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.url') }}</label>
      <input v-model="form.url" class="form-control" type="url" :disabled="busy" />
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('form.startDate') }}</label>
        <input v-model="form.startDate" class="form-control" type="date" :disabled="busy" />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('form.endDate') }}</label>
        <input v-model="form.endDate" class="form-control" type="date" :disabled="busy" />
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.summary') }}</label>
      <textarea v-model="form.summary" class="form-control" :disabled="busy"></textarea>
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
  organization: '',
  position: '',
  url: '',
  startDate: '',
  endDate: '',
  summary: '',
})
const submitted = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else
      form.value = {
        organization: '',
        position: '',
        url: '',
        startDate: '',
        endDate: '',
        summary: '',
      }
  },
  { immediate: true }
)

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (!form.value.organization || !form.value.position) return
  emit('submit', { ...form.value })
}
</script>
