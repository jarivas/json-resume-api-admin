<template>
  <div class="container py-4">
    <h2>{{ $t('chat.title') }}</h2>
    <div class="card mb-3">
      <div class="card-body chat-messages" style="max-height: 400px; overflow-y: auto;">
        <div v-if="!store.messages.length" class="text-muted">{{ $t('chat.empty') }}</div>
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
            {{ msg.content }}
          </span>
        </div>
        <div v-if="store.loading" class="text-muted mt-2">{{ $t('common.loading') }}</div>
      </div>
    </div>
    <div v-if="store.error" class="alert alert-danger">{{ store.error }}</div>
    <div class="input-group">
      <input
        v-model="message"
        class="form-control"
        :placeholder="$t('chat.placeholder')"
        :disabled="store.loading"
        @keyup.enter="send"
      />
      <button class="btn btn-primary" :disabled="store.loading || !message.trim()" @click="send">
        {{ $t('chat.send') }}
      </button>
      <button class="btn btn-outline-secondary" @click="store.clearSession()">
        {{ $t('chat.newSession') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChatStore } from '../../stores/modules/chat'

const store = useChatStore()
const message = ref('')

async function send() {
  const text = message.value.trim()
  if (!text) return
  message.value = ''
  await store.sendMessage(text)
}
</script>
