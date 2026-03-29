import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    busy: false,
  }),
  actions: {
    setBusy(v) {
      this.busy = !!v
    },
  },
})
