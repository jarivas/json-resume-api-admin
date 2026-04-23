<template>
  <div class="container py-4">
    <div v-if="selectedConversation">
      <button class="btn btn-outline-secondary mb-3" @click="backToList">
        &larr; {{ $t('common.back') }}
      </button>
      <h2>{{ $t('agentConversation.messagesTitle') }}</h2>
      <div v-if="store.loading" class="alert alert-info">{{ $t('common.loading') }}</div>
      <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
      <div v-else>
        <div
          v-for="(msg, idx) in store.messages"
          :key="idx"
          class="mb-2"
          :class="msg.role === 'user' ? 'text-end' : 'text-start'"
        >
          <span
            class="badge rounded-pill px-3 py-2"
            :class="msg.role === 'user' ? 'bg-primary' : 'bg-secondary'"
            style="white-space: pre-wrap; text-align: left; max-width: 75%; display: inline-block;"
          >
            {{ msg.content ?? msg.message ?? '-' }}
          </span>
          <div class="small text-muted">{{ msg.created_at ?? '' }}</div>
        </div>
        <div v-if="!store.messages.length" class="text-muted">{{ $t('common.noData') }}</div>
        <nav v-if="store.messagesLastPage > 1" class="mt-3">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: store.messagesPage <= 1 }">
              <button class="page-link" @click="changeMessagesPage(store.messagesPage - 1)">{{ $t('common.prev') }}</button>
            </li>
            <li
              v-for="p in store.messagesLastPage"
              :key="p"
              class="page-item"
              :class="{ active: p === store.messagesPage }"
            >
              <button class="page-link" @click="changeMessagesPage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: store.messagesPage >= store.messagesLastPage }">
              <button class="page-link" @click="changeMessagesPage(store.messagesPage + 1)">{{ $t('common.next') }}</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-else>
      <h2>{{ $t('agentConversation.title') }}</h2>
      <div v-if="store.loading" class="alert alert-info">{{ $t('common.loading') }}</div>
      <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
      <div v-else>
        <table v-if="store.conversations.length" class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>{{ $t('common.id') }}</th>
              <th>{{ $t('agentConversation.createdAt') }}</th>
              <th>{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="conv in store.conversations" :key="conv.id" style="cursor:pointer">
              <td class="text-muted small">{{ conv.id }}</td>
              <td class="small">{{ conv.created_at ?? '-' }}</td>
              <td>
                <button class="btn btn-sm btn-secondary" @click="viewMessages(conv)">
                  {{ $t('agentConversation.viewMessages') }}
                </button>
              </td>
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAgentConversationStore } from '../../stores/modules/agentConversation'

const store = useAgentConversationStore()
const selectedConversation = ref(null)

onMounted(() => store.fetchPage(1))

function changePage(page) {
  if (page < 1 || page > store.lastPage) return
  store.fetchPage(page)
}

function viewMessages(conv) {
  selectedConversation.value = conv
  store.fetchMessages(conv.id, 1)
}

function backToList() {
  selectedConversation.value = null
}

function changeMessagesPage(page) {
  if (!selectedConversation.value || page < 1 || page > store.messagesLastPage) return
  store.fetchMessages(selectedConversation.value.id, page)
}
</script>
