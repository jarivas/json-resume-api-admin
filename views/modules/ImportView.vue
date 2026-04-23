<template>
  <div class="container py-4">
    <h2>{{ $t('import.title') }}</h2>

    <!-- Import JSON Resume -->
    <div class="card mb-4">
      <div class="card-header">{{ $t('import.jsonTitle') }}</div>
      <div class="card-body">
        <p class="text-muted">{{ $t('import.jsonDesc') }}</p>
        <input type="file" accept="application/json,text/plain" class="form-control mb-2" @change="onJsonFile" :disabled="ui.busy" />
        <button class="btn btn-primary" :disabled="ui.busy || !jsonFile" @click="importJson">
          {{ $t('import.upload') }}
        </button>
        <div v-if="jsonError" class="alert alert-danger mt-2">{{ jsonError }}</div>
        <div v-if="jsonSuccess" class="alert alert-success mt-2">{{ $t('import.success') }}</div>
      </div>
    </div>

    <!-- Import Resume (PDF/DOC) -->
    <div class="card mb-4">
      <div class="card-header">{{ $t('import.resumeTitle') }}</div>
      <div class="card-body">
        <p class="text-muted">{{ $t('import.resumeDesc') }}</p>
        <input type="file" accept=".pdf,.doc,.docx" class="form-control mb-2" @change="onResumeFile" :disabled="ui.busy" />
        <button class="btn btn-primary" :disabled="ui.busy || !resumeFile" @click="importResume">
          {{ $t('import.upload') }}
        </button>
        <div v-if="resumeError" class="alert alert-danger mt-2">{{ resumeError }}</div>
        <div v-if="resumeSuccess" class="alert alert-success mt-2">{{ $t('import.success') }}</div>
      </div>
    </div>

    <!-- Import Education -->
    <div class="card mb-4">
      <div class="card-header">{{ $t('import.educationTitle') }}</div>
      <div class="card-body">
        <p class="text-muted">{{ $t('import.educationDesc') }}</p>
        <div class="mb-2">
          <input type="text" v-model="educationUrl" class="form-control" :placeholder="$t('form.importUrl')" :disabled="ui.busy" />
        </div>
        <div class="mb-2 text-muted small">{{ $t('common.or') }}</div>
        <input type="file" class="form-control mb-2" @change="onEducationFile" :disabled="ui.busy" />
        <button class="btn btn-primary" :disabled="ui.busy || (!educationUrl && !educationFile)" @click="importEducation">
          {{ $t('import.upload') }}
        </button>
        <div v-if="educationError" class="alert alert-danger mt-2">{{ educationError }}</div>
        <div v-if="educationSuccess" class="alert alert-success mt-2">{{ $t('import.success') }}</div>
      </div>
    </div>

    <!-- Import Certificate -->
    <div class="card mb-4">
      <div class="card-header">{{ $t('import.certificateTitle') }}</div>
      <div class="card-body">
        <p class="text-muted">{{ $t('import.certificateDesc') }}</p>
        <div class="mb-2">
          <input type="text" v-model="certificateUrl" class="form-control" :placeholder="$t('form.importUrl')" :disabled="ui.busy" />
        </div>
        <div class="mb-2 text-muted small">{{ $t('common.or') }}</div>
        <input type="file" class="form-control mb-2" @change="onCertificateFile" :disabled="ui.busy" />
        <button class="btn btn-primary" :disabled="ui.busy || (!certificateUrl && !certificateFile)" @click="importCertificate">
          {{ $t('import.upload') }}
        </button>
        <div v-if="certificateError" class="alert alert-danger mt-2">{{ certificateError }}</div>
        <div v-if="certificateSuccess" class="alert alert-success mt-2">{{ $t('import.success') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../services/api'
import { useUIStore } from '../../stores/ui'
import { useEducationStore } from '../../stores/modules/education'
import { useCertificateStore } from '../../stores/modules/certificate'

const ui = useUIStore()
const educationStore = useEducationStore()
const certificateStore = useCertificateStore()

const jsonFile = ref(null)
const jsonError = ref(null)
const jsonSuccess = ref(false)
function onJsonFile(e) { jsonFile.value = e.target.files[0] ?? null }

const resumeFile = ref(null)
const resumeError = ref(null)
const resumeSuccess = ref(false)
function onResumeFile(e) { resumeFile.value = e.target.files[0] ?? null }

const educationUrl = ref('')
const educationFile = ref(null)
const educationError = ref(null)
const educationSuccess = ref(false)
function onEducationFile(e) { educationFile.value = e.target.files[0] ?? null }

const certificateUrl = ref('')
const certificateFile = ref(null)
const certificateError = ref(null)
const certificateSuccess = ref(false)
function onCertificateFile(e) { certificateFile.value = e.target.files[0] ?? null }

async function importJson() {
  if (!jsonFile.value) return
  jsonError.value = null
  jsonSuccess.value = false
  ui.setBusy(true)
  try {
    const fd = new FormData()
    fd.append('file', jsonFile.value)
    await api.post('/import/json', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    jsonSuccess.value = true
  } catch (e) {
    jsonError.value = e.response?.data?.message || e.message
  } finally {
    ui.setBusy(false)
  }
}

async function importResume() {
  if (!resumeFile.value) return
  resumeError.value = null
  resumeSuccess.value = false
  ui.setBusy(true)
  try {
    const fd = new FormData()
    fd.append('file', resumeFile.value)
    await api.post('/import/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    resumeSuccess.value = true
  } catch (e) {
    resumeError.value = e.response?.data?.message || e.message
  } finally {
    ui.setBusy(false)
  }
}

async function importEducation() {
  educationError.value = null
  educationSuccess.value = false
  ui.setBusy(true)
  try {
    if (educationUrl.value) {
      await educationStore.importFromUrl(educationUrl.value)
    } else if (educationFile.value) {
      await educationStore.importFile(educationFile.value)
    }
    educationSuccess.value = true
  } catch (e) {
    educationError.value = educationStore.error || e.message
  } finally {
    ui.setBusy(false)
  }
}

async function importCertificate() {
  certificateError.value = null
  certificateSuccess.value = false
  ui.setBusy(true)
  try {
    if (certificateUrl.value) {
      await certificateStore.importFromUrl(certificateUrl.value)
    } else if (certificateFile.value) {
      await certificateStore.importFile(certificateFile.value)
    }
    certificateSuccess.value = true
  } catch (e) {
    certificateError.value = certificateStore.error || e.message
  } finally {
    ui.setBusy(false)
  }
}
</script>
