<template>
  <div>
    <div v-if="ui.busy" class="global-busy-overlay" role="status" aria-live="polite">
      <div class="busy-content text-center">
        <div class="spinner-border text-light" role="status" aria-hidden="true"></div>
        <div class="mt-3">
          <strong>{{ $t('navbar.importResume') || 'Importando...' }}</strong>
        </div>
        <div class="mt-1 small">{{ $t('messages.importInProgress') || 'El proceso de importación puede tardar varios minutos. Por favor espere.' }}</div>
      </div>
    </div>
    <Navbar
      v-if="$route.name !== 'login'"
      :locale="$i18n.locale"
      :busy="ui.busy"
      :unread="unreadCount"
      @change-locale="(val) => ($i18n.locale = val)"
      @open-add="openAddModal"
      @trigger-json-upload="triggerJsonUpload"
      @trigger-resume-upload="triggerResumeUpload"
      @seed-sample="seedSampleData"
      @toggle-notifications="toggleNotifications"
      @logout="() => $router.push('/login')"
    />

    <input
      id="sample-upload"
      type="file"
      accept="application/json"
      class="d-none"
      @change="handleJsonFile"
    />
    <input
      id="resume-upload"
      type="file"
      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      class="d-none"
      @change="handleResumeFile"
    />

    <main class="container py-4">
      <router-view />
    </main>

    <NotificationsPanel
      :show="showNotifications"
      :items="notifications"
      @close="showNotifications = false"
      @mark-all-read="markAllRead"
    />

    <div
      v-if="showAddModal"
      class="modal-backdrop d-flex align-items-center justify-content-center"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1050"
    >
      <div class="card p-3" style="width: 420px">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong>Añadir {{ addingModule }}</strong>
          <button class="btn-close" @click="closeAddModal"></button>
        </div>
        <div class="card-body">
          <div v-if="addingModule === 'basic'">
            <div class="mb-2">
              <label class="form-label">{{ $t('form.name') }}</label>
              <input v-model="formState.name" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">{{ $t('form.email') }}</label>
              <input v-model="formState.email" class="form-control" type="email" />
            </div>
            <div class="mb-2">
              <label class="form-label">{{ $t('form.phone') }}</label>
              <input v-model="formState.phone" class="form-control" />
            </div>
          </div>

          <div v-else-if="addingModule === 'award'">
            <div class="mb-2">
              <label class="form-label">{{ $t('form.title') }}</label>
              <input v-model="formState.name" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">{{ $t('form.date') }}</label>
              <input v-model="formState.date" class="form-control" type="date" />
            </div>
            <div class="mb-2">
              <label class="form-label">{{ $t('form.awarder') }}</label>
              <input v-model="formState.awarder" class="form-control" />
            </div>
          </div>

          <div v-else-if="addingModule === 'certificate'">
            <div class="mb-2">
              <label class="form-label">{{ $t('form.name') }}</label>
              <input v-model="formState.name" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">{{ $t('form.date') }}</label>
              <input v-model="formState.date" class="form-control" type="date" />
            </div>
            <div class="mb-2">
              <label class="form-label">{{ $t('form.issuer') }}</label>
              <input v-model="formState.issuer" class="form-control" />
            </div>
          </div>

          <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-secondary me-2" @click="closeAddModal" :disabled="ui.busy">
              {{ $t('form.cancel') }}
            </button>
            <button class="btn btn-primary" @click="createItem" :disabled="ui.busy">
              {{ $t('form.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from './components/Navbar.vue'
import NotificationsPanel from './components/NotificationsPanel.vue'
import api from './services/api'
import { useUIStore } from './stores/ui'

const showAddModal = ref(false)
const addingModule = ref('basic')
const formState = ref({})
const syncInProgress = ref(false)
const syncStatuses = reactive({})
const ui = useUIStore()
const showNotifications = ref(false)
const notifications = ref([])
const { t } = useI18n()
const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function persistNotifications() {
  try {
    localStorage.setItem('jr_notifications', JSON.stringify(notifications.value || []))
  } catch (e) {
    // ignore
  }
}

try {
  const saved = localStorage.getItem('jr_notifications')
  if (saved) notifications.value = JSON.parse(saved)
} catch (e) {
  notifications.value = []
}

// theme is handled by the ui store (stores/ui.js)

watch(notifications, () => persistNotifications(), { deep: true })

function openAddModal(module) {
  addingModule.value = module
  formState.value = {}
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}

function triggerJsonUpload() {
  const el = document.getElementById('sample-upload')
  if (el) el.click()
}

function triggerResumeUpload() {
  const el = document.getElementById('resume-upload')
  if (el) el.click()
}

async function handleResumeFile(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return alert('No file selected')

  const maxBytes = 20 * 1024 * 1024 // 20 MB
  const allowed = ['pdf', 'doc', 'docx']
  const name = file.name || ''
  const ext = name.split('.').pop().toLowerCase()
  if (!allowed.includes(ext)) return alert('Tipo de archivo no permitido. Solo pdf/doc/docx')
  if (file.size > maxBytes) return alert('Archivo demasiado grande (máx 20 MB)')

  ui.setBusy(true)
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await api.post('/import/resume', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    notifications.value.unshift({
      id: Date.now(),
      title: 'Importar CV',
      body: 'CV importado correctamente',
      read: false,
      date: new Date().toISOString(),
    })
    persistNotifications()
  } catch (err) {
    console.error(err)
    notifications.value.unshift({
      id: Date.now(),
      title: 'Importar CV',
      body: 'Error al importar CV',
      read: false,
      date: new Date().toISOString(),
    })
    persistNotifications()
    alert('Error al subir el CV')
  } finally {
    ui.setBusy(false)
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    let changed = false
    notifications.value = notifications.value.map((n) => {
      if (!n.read) {
        changed = true
        return { ...n, read: true }
      }
      return n
    })
    if (changed) persistNotifications()
  }
}

function markAllRead() {
  let changed = false
  notifications.value = notifications.value.map((n) => {
    if (!n.read) {
      changed = true
      return { ...n, read: true }
    }
    return n
  })
  if (changed) persistNotifications()
}

async function handleJsonFile(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return alert('No file selected')
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    await importJsonToStores(data)
    alert('JSON importado.')
  } catch (err) {
    console.error(err)
    alert('Error al leer/parsear el JSON')
  }
}

function capitalize(s) {
  return s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function findUseStore(mod, moduleName) {
  const explicit = mod[`use${capitalize(moduleName)}Store`]
  if (typeof explicit === 'function') return explicit
  const found = Object.values(mod).find((v) => typeof v === 'function' && /^use[A-Z]/.test(v.name))
  if (found) return found
  return null
}

function saveStoreItems(key, items) {
  try {
    localStorage.setItem(`jr_${key}`, JSON.stringify(items || []))
  } catch (e) {
    // ignore
  }
}

async function loadLocalStorageAtStartup() {
  const modules = [
    'basic',
    'award',
    'publication',
    'project',
    'language',
    'reference',
    'skill',
    'volunteer',
    'work',
    'certificate',
    'education',
    'interest',
  ]
  for (const key of modules) {
    try {
      const raw = localStorage.getItem(`jr_${key}`)
      if (!raw) continue
      const data = JSON.parse(raw)
      const mod = await import(`./stores/modules/${key}.js`)
      const useStoreFn = findUseStore(mod, key)
      if (!useStoreFn) continue
      const store = useStoreFn()
      store.items = Array.isArray(data) ? data : []
    } catch (e) {
      // skip
    }
  }
}

async function importJsonToStores(data) {
  const mapping = Object.keys(data || {})
  for (const key of mapping) {
    try {
      const mod = await import(`./stores/modules/${key}.js`)
      const useStoreFn = findUseStore(mod, key)
      if (!useStoreFn) continue
      const store = useStoreFn()
      if (!store.items) store.items = []
      store.items = Array.isArray(data[key]) ? data[key] : []
      saveStoreItems(key, store.items)
    } catch (e) {
      // skip unknown stores
    }
  }
}

async function syncToBackend() {
  const modules = [
    'basic',
    'award',
    'publication',
    'project',
    'language',
    'reference',
    'skill',
    'volunteer',
    'work',
    'certificate',
    'education',
    'interest',
  ]
  const uniqueField = {
    basic: 'email',
    award: 'name',
    publication: 'name',
    project: 'name',
    language: 'name',
    reference: 'name',
    skill: 'name',
    volunteer: 'name',
    work: 'name',
    certificate: 'name',
    education: 'name',
    interest: 'name',
  }
  for (const k of modules) syncStatuses[k] = { status: 'pending', created: 0, errors: 0 }
  syncInProgress.value = true

  let totalCreated = 0
  let totalErrors = 0
  for (const key of modules) {
    try {
      syncStatuses[key].status = 'in-progress'
      const mod = await import(`./stores/modules/${key}.js`)
      const useStoreFn = findUseStore(mod, key)
      if (!useStoreFn) continue
      const store = useStoreFn()
      if (!store.items || !store.items.length) continue
      if (typeof store.create !== 'function') continue

      let serverItems = []
      try {
        if (typeof store.fetchAll === 'function') {
          await store.fetchAll()
          serverItems = Array.isArray(store.items) ? store.items.slice() : []
        }
      } catch (e) {
        serverItems = []
      }

      const seen = new Set()
      let created = 0
      let errors = 0
      for (const item of store.items.slice()) {
        try {
          const keyField = uniqueField[key]
          const localVal = keyField ? (item[keyField] || '').toString().trim().toLowerCase() : null

          let matchedServer = null
          if (localVal && serverItems.length) {
            matchedServer = serverItems.find(
              (si) => (si[keyField] || '').toString().trim().toLowerCase() === localVal
            )
          }
          if (matchedServer) {
            if (!item.id || item.id !== matchedServer.id) {
              item.id = matchedServer.id
              saveStoreItems(key, store.items)
            }
            continue
          }

          if (localVal) {
            if (seen.has(localVal)) continue
            seen.add(localVal)
          }

          const { id, ...payload } = item
          await store.create(payload)
          created++
          syncStatuses[key].created = created
          totalCreated++

          if (typeof store.fetchAll === 'function') {
            await store.fetchAll()
            serverItems = Array.isArray(store.items) ? store.items.slice() : serverItems
            if (localVal && serverItems.length) {
              const newMatch = serverItems.find(
                (si) => (si[keyField] || '').toString().trim().toLowerCase() === localVal
              )
              if (newMatch) {
                const idx = store.items.findIndex(
                  (it) => (it[keyField] || '').toString().trim().toLowerCase() === localVal
                )
                if (idx !== -1) {
                  store.items[idx].id = newMatch.id
                  saveStoreItems(key, store.items)
                }
              }
            }
          }
        } catch (e) {
          errors++
          syncStatuses[key].errors = errors
          totalErrors++
        }
      }
      syncStatuses[key].status = errors ? 'error' : 'done'
    } catch (e) {
      syncStatuses[key].status = 'error'
    }
  }
  syncInProgress.value = false
  if (totalErrors) {
    notifications.value.unshift({
      title: t('notifications.title') || 'Notificaciones',
      body:
        t('notifications.syncError', { created: totalCreated, errors: totalErrors }) ||
        `Sync completed. Created: ${totalCreated}, Errors: ${totalErrors}`,
      type: 'error',
      read: false,
      time: Date.now(),
    })
    showNotifications.value = true
  } else {
    notifications.value.unshift({
      title: t('notifications.title') || 'Notificaciones',
      body:
        t('notifications.syncSuccess', { created: totalCreated }) ||
        `Sync completed. Created: ${totalCreated}`,
      type: 'success',
      read: false,
      time: Date.now(),
    })
  }
  persistNotifications()
  alert(`Sincronización completada. Creado: ${totalCreated}, Errores: ${totalErrors}`)
}

async function createItem() {
  const module = addingModule.value
  try {
    const mod = await import(`./stores/modules/${module}.js`)
    const useStoreFn = findUseStore(mod, module)
    if (!useStoreFn) throw new Error('Store not found')
    const store = useStoreFn()
    const payload = { ...(formState.value || {}) }
    if (!store.items) store.items = []
    if (typeof store.create === 'function') {
      await store.create(payload)
    } else {
      const nextId = store.items.length ? Math.max(...store.items.map((i) => i.id)) + 1 : 1
      store.items.push({ id: nextId, ...payload })
    }
    saveStoreItems(module, store.items)
    closeAddModal()
    alert('Elemento añadido')
  } catch (e) {
    console.error(e)
    alert('Error añadiendo elemento')
  }
}

async function seedSampleData() {
  try {
    const basic = await import('./stores/modules/basic')
    const award = await import('./stores/modules/award')
    const publication = await import('./stores/modules/publication')
    const project = await import('./stores/modules/project')
    const language = await import('./stores/modules/language')
    const reference = await import('./stores/modules/reference')
    const skill = await import('./stores/modules/skill')
    const volunteer = await import('./stores/modules/volunteer')
    const work = await import('./stores/modules/work')
    const certificate = await import('./stores/modules/certificate')
    const education = await import('./stores/modules/education')
    const interest = await import('./stores/modules/interest')

    const basicStore = basic.useBasicStore()
    basicStore.items = [{ id: 1, name: 'Usuario Demo', email: 'demo@example.com' }]

    const awardStore = award.useAwardStore()
    awardStore.items = [{ id: 1, name: 'Premio Demo' }]

    const pubStore = publication.usePublicationStore()
    pubStore.items = [{ id: 1, name: 'Publicación Demo' }]

    const projStore = project.useProjectStore()
    projStore.items = [{ id: 1, name: 'Proyecto Demo' }]

    const langStore = language.useLanguageStore()
    langStore.items = [{ id: 1, name: 'Español' }]

    const refStore = reference.useReferenceStore()
    refStore.items = [{ id: 1, name: 'Referencia Demo' }]

    const skillStore = skill.useSkillStore()
    skillStore.items = [{ id: 1, name: 'JavaScript' }]

    const volStore = volunteer.useVolunteerStore()
    volStore.items = [{ id: 1, name: 'Voluntariado Demo' }]

    const workStore = work.useWorkStore()
    workStore.items = [{ id: 1, name: 'Empresa Demo' }]

    const certStore = certificate.useCertificateStore()
    certStore.items = [{ id: 1, name: 'Certificado Demo', date: '', issuer: '', url: '' }]

    const eduStore = education.useEducationStore()
    eduStore.items = [{ id: 1, name: 'Grado Demo' }]

    const intStore = interest.useInterestStore()
    intStore.items = [{ id: 1, name: 'Interés Demo' }]

    alert('Datos de ejemplo cargados en memoria.')
    try {
      saveStoreItems('basic', basicStore.items)
      saveStoreItems('award', awardStore.items)
      saveStoreItems('publication', pubStore.items)
      saveStoreItems('project', projStore.items)
      saveStoreItems('language', langStore.items)
      saveStoreItems('reference', refStore.items)
      saveStoreItems('skill', skillStore.items)
      saveStoreItems('volunteer', volStore.items)
      saveStoreItems('work', workStore.items)
      saveStoreItems('certificate', certStore.items)
      saveStoreItems('education', eduStore.items)
      saveStoreItems('interest', intStore.items)
    } catch (e) {
      // ignore
    }
  } catch (e) {
    console.error('Error cargando datos de ejemplo', e)
    alert('No se pudieron cargar los datos de ejemplo. Revisa la consola.')
  }
}

onMounted(() => {
  loadLocalStorageAtStartup()
  try {
    if (typeof ui.initTheme === 'function') ui.initTheme()
  } catch (e) {
    // ignore
  }
})
</script>

<style>
:root{
  --bs-body-bg: #f8f9fa;
  --bs-body-color: #212529;
  --bs-card-bg: #ffffff;
  --bs-card-color: #212529;
  --bs-border-color: #dee2e6;
  --bs-input-bg: #ffffff;
  --bs-input-color: #212529;
  --bs-badge-danger-bg: #dc3545;
}

[data-bs-theme="dark"]{
  --bs-body-bg: #121212;
  --bs-body-color: #e9ecef;
  --bs-card-bg: #1e1e1e;
  --bs-card-color: #e9ecef;
  --bs-border-color: #2b2b2b;
  --bs-input-bg: #2a2a2a;
  --bs-input-color: #e9ecef;
  --bs-badge-danger-bg: #c0392b;
}

body {
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
}

/* Use Bootstrap color-mode via data-bs-theme, but keep a few component mappings */
.navbar {
  background-color: var(--bs-card-bg) !important;
}
.modal-backdrop,
.modal {
  background-color: rgba(0, 0, 0, 0.6);
}
.modal-content,
.card,
.card-body,
.card-header,
.list-group-item,
.dropdown-menu {
  background-color: var(--bs-card-bg);
  color: var(--bs-card-color);
  border-color: var(--bs-border-color);
}
.modal .btn,
.btn {
  color: var(--bs-card-color);
}
.badge.bg-danger {
  background-color: var(--bs-badge-danger-bg) !important;
}
input.form-control,
textarea.form-control {
  background-color: var(--bs-input-bg);
  color: var(--bs-input-color);
  border-color: var(--bs-border-color);
}

.global-busy-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.65);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.global-busy-overlay .busy-content {
  text-align: center;
}
</style>
