import { defineStore } from 'pinia';
import api from '../../services/api';

export const useProjectStore = defineStore('project', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/project');
        this.items = response.data.data ?? [];
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
    async create(data) {
      try {
        const sendData = { ...data }
        // Ensure roles, highlights, keywords are arrays of strings (backend expects strings)
        if (Array.isArray(sendData.roles)) {
          sendData.roles = sendData.roles
            .map((r) => (typeof r === 'string' ? r : r?.name || ''))
            .map((s) => (s || '').toString().trim())
            .filter(Boolean)
        }
        if (Array.isArray(sendData.highlights)) {
          sendData.highlights = sendData.highlights
            .map((h) => (typeof h === 'string' ? h : h?.name || ''))
            .map((s) => (s || '').toString().trim())
            .filter(Boolean)
        }
        if (Array.isArray(sendData.keywords)) {
          sendData.keywords = sendData.keywords
            .map((k) => (typeof k === 'string' ? k : k?.name || ''))
            .map((s) => (s || '').toString().trim())
            .filter(Boolean)
        }
        const response = await api.post('/project', sendData)
        await this.fetchAll()
        this.error = null
      } catch (e) {
        this.error = e.response?.data?.message || e.message
      }
    },
    async update(id, data) {
      try {
        const sendData = { ...data }
        if (Array.isArray(sendData.roles)) {
          sendData.roles = sendData.roles
            .map((r) => (typeof r === 'string' ? r : r?.name || ''))
            .map((s) => (s || '').toString().trim())
            .filter(Boolean)
        }
        const response = await api.patch(`/project/${id}`, sendData)
        await this.fetchAll()
        this.error = null
      } catch (e) {
        this.error = e.response?.data?.message || e.message
      }
    },
    async remove(id) {
      try {
        await api.delete(`/project/${id}`);
        await this.fetchAll();
        this.error = null;
      } catch (e) {
        this.error = e.response?.data?.message || e.message;
      }
    },
  },
});
