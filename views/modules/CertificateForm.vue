<template>
  <form @submit.prevent="onSubmit" novalidate>
    <!-- import by URL/file removed from popup per UX request -->
    <div class="mb-3">
      <label class="form-label">{{ $t('form.name') }}</label>
      <input
        v-model="form.name"
        class="form-control"
        placeholder="Certified Kubernetes Administrator"
        :class="{ 'is-invalid': submitted && !form.name }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.name" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.name') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.date') }}</label>
      <input
        v-model="form.date"
        class="form-control"
        placeholder="YYYY-MM-DD or YYYY-MM"
        :class="{ 'is-invalid': submitted && !form.date }"
        required
        :disabled="busy"
        type="date"
      />
      <div v-if="submitted && !form.date" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.date') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.issuer') }}</label>
      <input
        v-model="form.issuer"
        class="form-control"
        placeholder="CNCF"
        :class="{ 'is-invalid': submitted && !form.issuer }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.issuer" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.issuer') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.url') }}</label>
      <input
        v-model="form.url"
        class="form-control"
        placeholder="http://example.com"
        :class="{ 'is-invalid': submitted && !validUrl }"
        required
        :disabled="busy"
        type="url"
      />
      <div v-if="submitted && !form.url" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.url') }) }}
      </div>
      <div v-else-if="submitted && form.url && !validUrl" class="invalid-feedback">
        {{ $t('form.invalidUrl') }}
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="busy">{{ $t('form.save') }}</button>
    <button type="button" class="btn btn-secondary ms-2" @click="$emit('cancel')" :disabled="busy">
      {{ $t('form.cancel') }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCertificateStore } from '../../stores/modules/certificate'
const props = defineProps({
  modelValue: Object,
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel', 'imported'])
const form = ref({ name: '', date: '', issuer: '', url: '' })
const submitted = ref(false)
const busy = props.busy

const certificateStore = useCertificateStore()
// import functionality removed from popup (list views still support import)

watch(
  () => props.modelValue,
  (val) => {
    if (val) form.value = { ...form.value, ...val }
    else form.value = { name: '', date: '', issuer: '', url: '' }
  },
  { immediate: true }
)

const validUrl = computed(() => {
  // Simple URL regex
  return /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+(\/.*)?$/.test(form.value.url)
})

function onSubmit() {
  submitted.value = true
  if (
    !form.value.name ||
    !form.value.date ||
    !form.value.issuer ||
    !form.value.url ||
    !validUrl.value
  ) {
    return
  }
  emit('submit', { ...form.value })
}

// import handler removed

// file import via direct upload removed from popup; URL import remains
</script>
