import { defineStore } from 'pinia';
import api from '../../services/api';

export const useAgentConversationStore = defineStore('agentConversation', {
  state: () => ({
    conversations: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    messages: [],
    messagesPage: 1,
    messagesLastPage: 1,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPage(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/agent-conversation/${page}`);
        const data = response.data;
        this.conversations = data.data ?? [];
        this.currentPage = data.current_page ?? page;
        this.lastPage = data.last_page ?? 1;
        this.total = data.total ?? 0;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchMessages(conversationId, page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/agent-conversation/${conversationId}/messages/${page}`);
        const data = response.data;
        this.messages = data.data ?? [];
        this.messagesPage = data.current_page ?? page;
        this.messagesLastPage = data.last_page ?? 1;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
