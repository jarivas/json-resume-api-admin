<template>
  <div class="container py-4">
    <h2>{{ $t('education.title') }}</h2>
    <button class="btn btn-primary mb-3" @click="openCreate" :disabled="ui.busy">
      {{ $t('common.create') }}
    </button>
    <div class="mb-3">
      <div class="input-group">
        <input v-model="importUrl" type="url" class="form-control" placeholder="http://example.com/resume.pdf" :disabled="ui.busy || importing" :aria-label="$t('form.importUrl')" />
        <button class="btn btn-outline-primary" type="button" @click="handleImportUrl" :disabled="!importUrl || ui.busy || importing" :aria-label="$t('form.importUrl')">{{ $t('form.importUrl') }}</button>
      </div>
      <small class="form-text text-muted">{{ $t('form.importUrlHelp') }}</small>
      <div class="input-group mt-2">
        <input ref="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg" class="form-control" @change="handleFileChange" :disabled="ui.busy || importing" :aria-label="$t('form.importFile')" />
        <button class="btn btn-outline-primary" type="button" @click="handleImportFile" :disabled="!selectedFile || ui.busy || importing" :aria-label="$t('form.importFile')">{{ $t('form.importFile') }}</button>
      </div>
      <small class="form-text text-muted">{{ $t('form.importFileHelp') }}</small>
      <div v-if="importError" class="text-danger small mt-1">{{ importError }}</div>
      <div v-if="importSuccess" class="text-success small mt-1">{{ importSuccess }}</div>
    </div>
    <div v-if="store.loading" class="alert alert-info">{{ $t('common.loading') }}</div>
    <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
    <table v-else-if="store.items.length" class="table table-bordered">
      <thead>
        <tr>
          <th>{{ $t('form.institution') }}</th>
          <th>{{ $t('form.area') }}</th>
          <th>{{ $t('form.startDate') }}</th>
          <th>{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.items" :key="item.id">
          <td>{{ item.institution }}</td>
          <td>{{ item.area }}</td>
          <td>{{ item.startDate }}</td>
          <td>
            <button class="btn btn-sm btn-secondary" @click="editItem(item)" :disabled="ui.busy">{{ $t('common.edit') }}</button>
            <button class="btn btn-sm btn-danger ms-2" @click="deleteItem(item.id)" :disabled="ui.busy">{{ $t('common.delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>{{ $t('common.noData') }}</div>

    <AddModal :show="showModal" :addingModule="modalLabel" :value="formModel" @close="closeModal" @save="onSave">
      <template #body>
        <EducationForm :modelValue="formModel" :busy="ui.busy" @submit="onSave" @cancel="closeModal" />
      </template>
    </AddModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEducationStore } from '../../stores/modules/education'
import AddModal from '../../components/AddModal.vue'
import EducationForm from './EducationForm.vue'
import { useUIStore } from '../../stores/ui'

const store = useEducationStore()
const { t } = useI18n()
const importUrl = ref('')
const selectedFile = ref(null)
const importing = ref(false)
const importError = ref(null)
const importSuccess = ref(null)
const fileInput = ref(null)
const showModal = ref(false)
const formModel = ref(null)
const editingId = ref(null)
const modalLabel = ref('education')
const ui = useUIStore()

onMounted(() => store.fetchAll())

function openCreate() {
  editingId.value = null
  formModel.value = { name: '' }
  modalLabel.value = 'education'
  showModal.value = true
}

function editItem(item) {
  editingId.value = item.id
  formModel.value = { ...item }
  modalLabel.value = 'education'
  showModal.value = true
}

async function onSave(payload) {
  ui.setBusy(true)
  try {
    if (editingId.value) await store.update(editingId.value, payload)
    else await store.create(payload)
    showModal.value = false
  } finally {
    ui.setBusy(false)
  }
}

function closeModal() {
  showModal.value = false
}

async function deleteItem(id) {
  ui.setBusy(true)
  try {
    await store.remove(id)
  } finally {
    ui.setBusy(false)
  }
}

function handleFileChange(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) {
    selectedFile.value = null
    return
  }
  const MAX = 10 * 1024 * 1024 // 10 MB
  const isPdf = f.type === 'application/pdf'
  const isImage = f.type === 'image/png' || f.type === 'image/jpeg' || f.type === 'image/jpg'
  if (!isPdf && !isImage) {
    importError.value = t('errors.invalidFileType')
    selectedFile.value = null
    return
  }
  if (f.size > MAX) {
    importError.value = t('errors.fileTooLarge', { max: '10MB' })
    selectedFile.value = null
    return
  }
  importError.value = null
  selectedFile.value = f
}

async function handleImportUrl() {
  if (!importUrl.value) return
  importing.value = true
  importError.value = null
  importSuccess.value = null
  ui.setBusy(true)
  try {
    await store.importFromUrl(importUrl.value)
    importSuccess.value = 'Imported successfully'
    await store.fetchAll()
    importUrl.value = ''
  } catch (e) {
    importError.value = e?.response?.data?.message || e?.message || 'Import failed'
  } finally {
    importing.value = false
    ui.setBusy(false)
  }
}

async function handleImportFile() {
  if (!selectedFile.value) return
  importing.value = true
  importError.value = null
  importSuccess.value = null
  ui.setBusy(true)
  try {
    await store.importFile(selectedFile.value)
    importSuccess.value = 'Imported successfully'
    await store.fetchAll()
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = null
  } catch (e) {
    importError.value = e?.response?.data?.message || e?.message || 'Import failed'
  } finally {
    importing.value = false
    ui.setBusy(false)
  }
}
</script>
