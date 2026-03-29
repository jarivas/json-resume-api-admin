import { defineStore } from 'pinia';

export const useResourceStore = defineStore('resource', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    fetchAll() {
      // noop for tests / can be implemented to call API
    },
  },
});
