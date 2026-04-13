<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ $t('navbar.brand') }}</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/basics">{{ $t('basic.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/certificates">{{
              $t('certificate.title')
            }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/education">{{ $t('education.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/interests">{{ $t('interest.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/languages">{{ $t('language.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/projects">{{ $t('project.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/publications">{{
              $t('publication.title')
            }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/references">{{ $t('reference.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/skills">{{ $t('skill.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/volunteers">{{ $t('volunteer.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/work">{{ $t('work.title') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/awards">{{ $t('award.title') }}</router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item me-3 d-flex align-items-center">
            <div class="btn-group" role="group" aria-label="Language selector">
              <button
                type="button"
                class="btn btn-outline-light btn-sm d-flex align-items-center"
                :class="{ active: locale === 'es' }"
                @click.prevent="handleSetLocale('es')"
                title="Español"
              >
                <span class="fi fi-es me-1" aria-hidden="true"></span>
                <span class="visually-hidden">Español</span>
              </button>
              <button
                type="button"
                class="btn btn-outline-light btn-sm d-flex align-items-center"
                :class="{ active: locale === 'en' }"
                @click.prevent="handleSetLocale('en')"
                title="English"
              >
                <span class="fi fi-gb me-1" aria-hidden="true"></span>
                <span class="visually-hidden">English</span>
              </button>
            </div>
          </li>

          <!-- 'Añadir' dropdown removed per user request -->

          <li class="nav-item me-2 d-flex align-items-center">
            <div class="d-flex align-items-center">
              <button
                class="btn btn-outline-light btn-sm me-2"
                @click="handleThemeToggle"
                :title="$t('navbar.theme') || 'Theme'"
              >
                <i v-if="ui.theme === 'dark'" class="bi bi-moon-fill" aria-hidden="true"></i>
                <i v-else class="bi bi-sun-fill" aria-hidden="true"></i>
              </button>
              <button
                class="btn btn-outline-light btn-sm me-2 d-flex align-items-center"
                @click="handleTriggerResume"
                :title="$t('navbar.importResume') || 'Importar CV'"
              >
                <i class="bi bi-file-earmark-arrow-up me-1" aria-hidden="true"></i>
                {{ $t('navbar.importResumeShort') || 'Importar CV' }}
              </button>
              <button
                class="btn btn-outline-light btn-sm position-relative"
                @click="handleSyncToggle"
                aria-label="Notificaciones"
              >
                <i class="bi bi-bell" aria-hidden="true"></i>
                <span
                  v-if="props.unread > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  >{{ props.unread }}</span
                >
              </button>
            </div>
          </li>
          <!-- Logout link removed per user request -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue'
import { useUIStore } from '../stores/ui'
const props = defineProps({
  locale: { type: String, default: 'es' },
  busy: { type: Boolean, default: false },
  unread: { type: Number, default: 0 },
})
const ui = useUIStore()
const emit = defineEmits([
  'change-locale',
  'open-add',
  'trigger-json-upload',
  'trigger-resume-upload',
  'seed-sample',
  'toggle-notifications',
  'logout',
])

function handleSetLocale(lang) {
  if (props.busy) return
  emit('change-locale', lang)
}

function handleOpenAdd(module) {
  if (props.busy) return
  emit('open-add', module)
}
function handleTriggerJson() {
  if (props.busy) return
  emit('trigger-json-upload')
}
function handleSeed() {
  if (props.busy) return
  emit('seed-sample')
}
function handleSyncToggle() {
  if (props.busy) return
  emit('toggle-notifications')
}

function handleThemeToggle() {
  if (props.busy) return
  ui.toggleTheme()
}
function handleTriggerResume() {
  if (props.busy) return
  emit('trigger-resume-upload')
}
</script>

<style scoped>
.navbar-brand {
  font-weight: 600;
}
</style>
