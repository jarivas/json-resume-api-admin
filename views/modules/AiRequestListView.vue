<template>
  <div class="container py-4">
    <h2>{{ $t('aiRequest.title') }}</h2>
    <div v-if="store.loading" class="alert alert-info">{{ $t('common.loading') }}</div>
    <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
    <div v-else>
      <table v-if="store.items.length" class="table table-bordered">
        <thead>
          <tr>
            <th>{{ $t('common.id') }}</th>
            <th>{{ $t('aiRequest.request') }}</th>
            <th>{{ $t('aiRequest.response') }}</th>
            <th>{{ $t('aiRequest.createdAt') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.items" :key="item.id">
            <td class="text-muted small">{{ item.id }}</td>
            <td>{{ item.request ?? item.message ?? '-' }}</td>
            <td>{{ item.response ?? '-' }}</td>
            <td class="small">{{ item.created_at ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-muted">{{ $t('common.noData') }}</div>
      <nav v-if="store.lastPage > 1" class="mt-3">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: store.currentPage <= 1 }">
            <button class="page-link" @click="changePage(store.currentPage - 1)">{{ $t('common.prev') }}</button>
          </li>
          <li
            v-for="p in store.lastPage"
            :key="p"
            class="page-item"
            :class="{ active: p === store.currentPage }"
          >
            <button class="page-link" @click="changePage(p)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: store.currentPage >= store.lastPage }">
            <button class="page-link" @click="changePage(store.currentPage + 1)">{{ $t('common.next') }}</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAiRequestStore } from '../../stores/modules/aiRequest'

const store = useAiRequestStore()

onMounted(() => store.fetchPage(1))

function changePage(page) {
  if (page < 1 || page > store.lastPage) return
  store.fetchPage(page)
}
</script>
