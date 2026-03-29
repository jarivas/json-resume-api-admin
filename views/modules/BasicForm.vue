<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.name') }}</label>
      <input
        v-model="form.name"
        class="form-control"
        placeholder=""
        :class="{ 'is-invalid': submitted && !form.name }"
        required
        :disabled="busy"
      />
      <div v-if="submitted && !form.name" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.name') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.label') }}</label>
      <input
        v-model="form.label"
        class="form-control"
        placeholder="e.g. Web Developer"
        :class="{ 'is-invalid': submitted && !form.label }"
        required
      />
      <div v-if="submitted && !form.label" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.label') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.email') }}</label>
      <input
        v-model="form.email"
        class="form-control"
        placeholder="e.g. thomas@gmail.com"
        :class="{ 'is-invalid': submitted && !validEmail }"
        required
        type="email"
      />
      <div v-if="submitted && !form.email" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.email') }) }}
      </div>
      <div v-else-if="submitted && form.email && !validEmail" class="invalid-feedback">
        {{ $t('form.invalidEmail') }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.phone') }}</label>
      <input
        v-model="form.phone"
        class="form-control"
        placeholder="e.g. +1 555 1234"
        :class="{ 'is-invalid': submitted && !form.phone }"
        required
      />
      <div v-if="submitted && !form.phone" class="invalid-feedback">
        {{ $t('form.required', { field: $t('form.phone') }) }}
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.url') }}</label>
      <input
        v-model="form.url"
        class="form-control"
        type="url"
        :disabled="busy"
        placeholder="e.g. http://your-site.example.com"
      />
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.image') || 'Image URL' }}</label>
      <input
        v-model="form.image"
        class="form-control"
        type="url"
        :disabled="busy"
        placeholder="e.g. https://example.com/photo.jpg"
      />
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.summary') }}</label>
      <textarea
        v-model="form.summary"
        class="form-control"
        rows="3"
        :disabled="busy"
        placeholder="Write a short 2-3 sentence biography about yourself"
      ></textarea>
    </div>

    <h5 class="mt-3">{{ $t('form.location') || 'Location' }}</h5>
    <div class="mb-2">
      <label class="form-label">{{ $t('form.address') || 'Address' }}</label>
      <input
        v-model="form.location.address"
        class="form-control"
        :disabled="busy"
        placeholder="e.g. 1234 Glücklichkeit Straße"
      />
    </div>
    <div class="row">
      <div class="col-md-4 mb-2">
        <label class="form-label">{{ $t('form.postalCode') || 'Postal Code' }}</label>
        <input
          v-model="form.location.postalCode"
          class="form-control"
          :disabled="busy"
          placeholder="e.g. 28013"
        />
      </div>
      <div class="col-md-4 mb-2">
        <label class="form-label">{{ $t('form.city') || 'City' }}</label>
        <input
          v-model="form.location.city"
          class="form-control"
          :disabled="busy"
          placeholder="e.g. Madrid"
        />
      </div>
      <div class="col-md-4 mb-2">
        <label class="form-label">{{ $t('form.region') || 'Region' }}</label>
        <input
          v-model="form.location.region"
          class="form-control"
          :disabled="busy"
          placeholder="e.g. Comunidad de Madrid"
        />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">{{ $t('form.countryCode') || 'Country Code' }}</label>
      <input
        v-model="form.location.countryCode"
        class="form-control"
        :disabled="busy"
        placeholder="e.g. ES"
      />
    </div>

    <h5 class="mt-3">{{ $t('form.profiles') || 'Profiles' }}</h5>
    <div v-for="(p, idx) in form.profiles" :key="idx" class="border rounded p-2 mb-2">
      <div class="mb-2">
        <label class="form-label">Network</label>
        <input v-model="p.network" class="form-control" placeholder="e.g. Twitter" />
      </div>
      <div class="mb-2">
        <label class="form-label">Username</label>
        <input v-model="p.username" class="form-control" placeholder="e.g. neutralthoughts" />
      </div>
      <div class="mb-2">
        <label class="form-label">URL</label>
        <input
          v-model="p.url"
          class="form-control"
          type="url"
          placeholder="e.g. http://twitter.example.com/neutralthoughts"
        />
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" @click="removeProfile(idx)">
          Remove
        </button>
      </div>
    </div>
    <div class="mb-3">
      <button type="button" class="btn btn-sm btn-outline-primary" @click="addProfile">
        Add profile
      </button>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="busy">{{ $t('form.save') }}</button>
    <button type="button" class="btn btn-secondary ms-2" @click="$emit('cancel')" :disabled="busy">
      {{ $t('form.cancel') }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
const props = defineProps({
  modelValue: Object,
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])
const form = ref({
  name: '',
  label: '',
  image: '',
  email: '',
  phone: '',
  url: '',
  summary: '',
  location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
  profiles: [],
})
const submitted = ref(false)
const busy = props.busy

watch(
  () => props.modelValue,
  (val) => {
    if (val)
      form.value = {
        ...form.value,
        ...val,
        location: { ...form.value.location, ...(val.location || {}) },
        profiles: Array.isArray(val.profiles) ? val.profiles.slice() : form.value.profiles,
      }
    else
      form.value = {
        name: '',
        label: '',
        image: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
        profiles: [],
      }
  },
  { immediate: true }
)

const validEmail = computed(() => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
})

function onSubmit() {
  if (props.busy) return
  submitted.value = true
  if (
    !form.value.name ||
    !form.value.label ||
    !form.value.email ||
    !form.value.phone ||
    !validEmail.value
  ) {
    return
  }
  emit('submit', { ...form.value })
}

function addProfile() {
  form.value.profiles.push({ network: '', username: '', url: '' })
}

function removeProfile(idx) {
  form.value.profiles.splice(idx, 1)
}
</script>
