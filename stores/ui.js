import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    busy: false,
    theme: 'light',
  }),
  getters: {
    isDark: (state) => state.theme === 'dark',
  },
  actions: {
    setBusy(v) {
      this.busy = !!v
    },
    setTheme(name) {
      this.theme = name === 'dark' ? 'dark' : 'light'
      try {
        localStorage.setItem('jr_theme', this.theme)
      } catch (e) {
        // ignore
      }
      this._applyThemeClass(this.theme)
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
    initTheme() {
      try {
        const saved = localStorage.getItem('jr_theme')
        if (saved) {
          this.theme = saved === 'dark' ? 'dark' : 'light'
          this._applyThemeClass(this.theme)
          return
        }
        if (window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.theme = 'dark'
          this._applyThemeClass('dark')
          return
        }
      } catch (e) {
        // ignore
      }
      this._applyThemeClass(this.theme)
    },
    _applyThemeClass(name) {
      try {
        if (typeof document !== 'undefined' && document.documentElement) {
          document.documentElement.setAttribute('data-bs-theme', name === 'dark' ? 'dark' : 'light')
        }
      } catch (e) {
        // ignore
      }
    },
  },
})
