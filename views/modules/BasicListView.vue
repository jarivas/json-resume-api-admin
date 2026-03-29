<template>
  <div class="container py-4">
    <h2>{{ $t('basic.title') }}</h2>
    <div v-if="store.loading" class="alert alert-info">{{ $t('common.loading') }}</div>
    <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>

    <div v-else>
      <BasicForm :modelValue="formModel" :busy="ui.busy" @submit="onSave" @cancel="onCancel" />

      <div class="mt-3">
        <button
          v-if="hasItem"
          class="btn btn-danger me-2"
          @click="deleteCurrent"
          :disabled="ui.busy"
        >
          {{ $t('common.delete') }}
        </button>
        <button class="btn btn-secondary" @click="resetForm" :disabled="ui.busy">
          {{ $t('common.reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useBasicStore } from '../../stores/modules/basic'
import BasicForm from './BasicForm.vue'
import { useUIStore } from '../../stores/ui'

const store = useBasicStore()
const ui = useUIStore()

const formModel = ref({
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

const hasItem = computed(() => !!store.item)
const currentId = computed(() => (hasItem.value ? store.item.id : null))

onMounted(() => store.fetchAll())

watch(
  () => store.item,
  (item) => {
    if (item) formModel.value = { ...formModel.value, ...item }
    else
      formModel.value = {
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

async function onSave(payload) {
  ui.setBusy(true)
  try {
    if (hasItem.value) await store.update(currentId.value, payload)
    else await store.create(payload)
  } finally {
    ui.setBusy(false)
  }
}

function onCancel() {
  if (hasItem.value) formModel.value = { ...store.item }
  else
    formModel.value = {
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
}

function resetForm() {
  onCancel()
}

async function deleteCurrent() {
  if (!hasItem.value) return
  ui.setBusy(true)
  try {
    await store.remove(currentId.value)
    formModel.value = {
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
  } finally {
    ui.setBusy(false)
  }
}
</script>
