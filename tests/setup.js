import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import messages from '../locales';
import { routerKey } from 'vue-router'

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages,
});

// Silence a benign node/jsdom warning about --localstorage-file when it's empty
// (Vitest/jsdom may surface this). Ignore it to keep test output clean.
if (typeof process !== 'undefined' && typeof process.emitWarning === 'function') {
  const _emitWarning = process.emitWarning.bind(process)
  process.emitWarning = (warning, ...args) => {
    try {
      if (typeof warning === 'string' && warning.includes('--localstorage-file')) return
    } catch (e) {
      // fallthrough
    }
    return _emitWarning(warning, ...args)
  }
}

// Provide a lightweight router stub for tests that don't install a real router.
const RouterStub = {
  install(app) {
    const stub = { push: () => Promise.resolve(), currentRoute: { value: { name: null } } }
    app.provide(routerKey, stub)
    app.config.globalProperties.$router = stub
    Object.defineProperty(app.config.globalProperties, '$route', {
      configurable: true,
      get: () => stub.currentRoute,
    })
  },
}

// Ensure a simple localStorage mock exists in the test environment
if (typeof globalThis.localStorage === 'undefined') {
  let store = {}
  const mock = {
    getItem(key) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null },
    setItem(key, value) { store[key] = String(value) },
    removeItem(key) { delete store[key] },
    clear() { store = {} },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => mock,
    set: () => {},
  })
}

// Register i18n and a lightweight router stub globally for tests.
config.global.plugins = [i18n, RouterStub];
