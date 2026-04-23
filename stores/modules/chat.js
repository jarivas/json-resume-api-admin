import { defineStore } from 'pinia';
import api from '../../services/api';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
    sessionId: null,
  }),
  actions: {
    async sendMessage(message, metadata = null) {
      this.loading = true;
      this.error = null;
      try {
        const payload = { message, session_id: this.sessionId };
        if (metadata) payload.metadata = metadata;
        const response = await api.post('/chat', payload);
        const data = response.data;
        if (data.session_id) this.sessionId = data.session_id;
        this.messages.push({ role: 'user', content: message });
        this.messages.push({ role: 'assistant', content: data.message ?? data.response ?? '' });
        return data;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    clearSession() {
      this.messages = [];
      this.sessionId = null;
      this.error = null;
    },
  },
});
