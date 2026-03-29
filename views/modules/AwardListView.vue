<template>
  <div class="container py-4">
    <h2>{{ $t('award.title') }}</h2>
    <button class="btn btn-primary mb-3" @click="openCreate" :disabled="ui.busy">
      {{ $t('common.create') }}
    </button>
    <div v-if="store.loading" class="alert alert-info">{{ $t('common.loading') }}</div>
    <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
    <table v-else-if="store.items.length" class="table table-bordered">
      <thead>
        <tr>
          <th>{{ $t('common.id') }}</th>
          <th>{{ $t('form.name') }}</th>
          <th>{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title || item.name }}</td>
          <td>
            <button class="btn btn-sm btn-secondary" @click="editAward(item)" :disabled="ui.busy">
              {{ $t('common.edit') }}
            </button>
            <button
              class="btn btn-sm btn-danger ms-2"
              @click="deleteAward(item.id)"
              :disabled="ui.busy"
            >
              {{ $t('common.delete') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>{{ $t('common.noData') }}</div>
    <AddModal
      :show="showModal"
      :addingModule="modalLabel"
      :value="formModel"
      @close="closeModal"
      @save="onSave"
    >
      <template #body>
        <AwardForm :modelValue="formModel" :busy="ui.busy" @submit="onSave" @cancel="closeModal" />
      </template>
    </AddModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAwardStore } from '../../stores/modules/award'
import AddModal from '../../components/AddModal.vue'
import AwardForm from './AwardForm.vue'
import { useUIStore } from '../../stores/ui'

const store = useAwardStore()
const showModal = ref(false)
const formModel = ref(null)
const editingId = ref(null)
const modalLabel = ref('award')
const ui = useUIStore()

onMounted(() => {
  store.fetchAll()
})

function openCreate() {
  editingId.value = null
  formModel.value = { title: '', date: '', awarder: '', summary: '' }
  modalLabel.value = 'award'
  showModal.value = true
}

function editAward(item) {
  editingId.value = item.id
  formModel.value = { ...item }
  modalLabel.value = 'award'
  showModal.value = true
}

async function onSave(payload) {
  ui.setBusy(true)
  try {
    if (editingId.value) {
      await store.update(editingId.value, payload)
    } else {
      await store.create(payload)
    }
    showModal.value = false
  } finally {
    ui.setBusy(false)
  }
}

function closeModal() {
  showModal.value = false
}

async function deleteAward(id) {
  ui.setBusy(true)
  try {
    await store.remove(id)
  } finally {
    ui.setBusy(false)
  }
}
</script>
