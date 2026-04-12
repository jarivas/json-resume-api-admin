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
      <label class="form-label">{{ $t('form.description') }}</label>
      <textarea
        v-model="form.description"
        class="form-control"
        placeholder="Short summary of project"
        :disabled="busy"
      ></textarea>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.url') }}</label>
      <input
        v-model="form.url"
        class="form-control"
        type="url"
        placeholder="http://www.example.com/project"
        :disabled="busy"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('form.roles') }}</label>
      <input
        v-model="form.roles"
        class="form-control"
        placeholder="Team Lead, Writer (comma separated)"
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
const form = ref({ name: '', description: '', url: '', roles: '', startDate: '', endDate: '' })
const submitted = ref(false)
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else form.value = { name: '', description: '', url: '', roles: '', startDate: '', endDate: '' }
  },
  { immediate: true }
)

function onSubmit() {
  if (busy) return
  submitted.value = true
  if (!form.value.name) return
  const payload = { ...form.value }
  payload.roles = payload.roles
    ? payload.roles
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  emit('submit', payload)
}
</script>
