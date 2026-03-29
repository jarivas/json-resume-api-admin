<template>
  <div v-if="show" class="notifications-panel" role="dialog" aria-label="Notificaciones">
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ $t('notifications.title') || 'Notificaciones' }}</strong>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-link me-2" @click.prevent="$emit('mark-all-read')">
            {{ $t('notifications.markAll') || 'Marcar todas leídas' }}
          </button>
          <button class="btn-close" @click="$emit('close')"></button>
        </div>
      </div>
      <div class="card-body p-2">
        <ul class="list-group list-group-flush">
          <li v-if="!items || !items.length" class="list-group-item small text-muted">
            {{ $t('notifications.noNotifications') || 'No hay notificaciones' }}
          </li>
          <li v-for="(n, i) in items" :key="i" class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="small fw-semibold">{{ n.title }}</div>
                <div class="text-muted small">{{ n.body }}</div>
              </div>
              <div class="ms-2 text-end">
                <span v-if="n.type === 'error'" class="badge bg-danger">Error</span>
                <span v-else-if="n.type === 'success'" class="badge bg-success">OK</span>
                <span v-else class="badge bg-secondary">Info</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ show: Boolean, items: { type: Array, default: () => [] } })
</script>

<style scoped>
.notifications-panel {
  position: fixed;
  top: 56px;
  right: 16px;
  z-index: 1060;
  width: 320px;
}
.notifications-panel .card {
  max-height: 60vh;
  overflow: auto;
}
</style>
