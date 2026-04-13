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

    <h5 class="mt-3">{{ $t('form.roles') }}</h5>
    <div v-for="(r, idx) in form.roles" :key="idx" class="mb-2 border rounded p-2">
      <div class="mb-2">
        <label class="form-label">{{ $t('form.roles') }} {{ idx + 1 }}</label>
        <input v-model="form.roles[idx]" class="form-control" :disabled="busy" />
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" @click="removeRole(idx)">Remove</button>
      </div>
    </div>
    <div class="mb-3">
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addRole">Add role</button>
    </div>

    <h5 class="mt-3">{{ $t('form.highlights') }}</h5>
    <div v-for="(h, idx) in form.highlights" :key="idx" class="mb-2 border rounded p-2">
      <div class="mb-2">
        <label class="form-label">{{ $t('form.highlights') }} {{ idx + 1 }}</label>
        <input v-model="form.highlights[idx]" class="form-control" :disabled="busy" />
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" @click="removeHighlight(idx)">Remove</button>
      </div>
    </div>
    <div class="mb-3">
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addHighlight">Add highlight</button>
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
const form = ref({ name: '', description: '', url: '', roles: [], highlights: [], keywords: [], startDate: '', endDate: '' })
const submitted = ref(false)
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val)
      form.value = {
        ...form.value,
        ...val,
        keywords: Array.isArray(val.keywords) ? val.keywords.slice() : form.value.keywords,
        highlights: Array.isArray(val.highlights) ? val.highlights.slice() : form.value.highlights,
        roles: Array.isArray(val.roles) ? val.roles.slice() : Array.isArray(val.roles) ? val.roles : form.value.roles,
      }
    else
      form.value = { name: '', description: '', url: '', roles: [], highlights: [], keywords: [], startDate: '', endDate: '' }
  },
  { immediate: true }
)

function onSubmit() {
  if (busy) return
  submitted.value = true
  if (!form.value.name) return
  const payload = { ...form.value }
  payload.roles = Array.isArray(payload.roles)
    ? payload.roles.map((s) => (s || '').toString().trim()).filter(Boolean)
    : []
  payload.highlights = Array.isArray(payload.highlights)
    ? payload.highlights.map((s) => (s || '').toString().trim()).filter(Boolean)
    : []
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

function addHighlight() {
  form.value.highlights.push('')
}

function removeHighlight(idx) {
  form.value.highlights.splice(idx, 1)
}

function addRole() {
  form.value.roles.push('')
}

function removeRole(idx) {
  form.value.roles.splice(idx, 1)
}
</script>
