import { defineStore } from 'pinia';
import defaultApi from '../../services/api';

export function createSkillStore(api = defaultApi) {
  return defineStore('skill', {
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
          const response = await api.get('/skill');
          this.items = response.data;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        } finally {
          this.loading = false;
        }
      },
      async create(data) {
        try {
          await api.post('/skill', data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async update(id, data) {
        try {
          await api.patch(`/skill/${id}`, data);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
      async remove(id) {
        try {
          await api.delete(`/skill/${id}`);
          await this.fetchAll();
          this.error = null;
        } catch (e) {
          this.error = e.response?.data?.message ?? null;
        }
      },
    },
  });
}

export const useSkillStore = createSkillStore();
