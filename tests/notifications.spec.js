// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../app.vue'
import Navbar from '../components/Navbar.vue'
import NotificationsPanel from '../components/NotificationsPanel.vue'
import { createPinia } from 'pinia'

describe('Notifications persistence and unread badge', () => {
  beforeEach(() => {
    try {
      localStorage.removeItem('jr_notifications')
    } catch (e) {
      // ignore
    }
  })

  it('loads notifications from localStorage and marks them read when toggled', async () => {
    // Ensure a simple localStorage mock is available for this test run
    const mockStore = {}
    const mock = {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(mockStore, key) ? mockStore[key] : null
      },
      setItem(key, value) {
        mockStore[key] = String(value)
      },
      removeItem(key) {
        delete mockStore[key]
      },
    }
    try {
      Object.defineProperty(globalThis, 'localStorage', { value: mock, configurable: true })
    } catch (e) {
      // ignore in environments that disallow redefining localStorage
    }

    const initial = [
      { title: 'A', body: 'one', read: false, time: 1 },
      { title: 'B', body: 'two', read: true, time: 2 },
    ]
    localStorage.setItem('jr_notifications', JSON.stringify(initial))

    const wrapper = mount(App, { global: { plugins: [createPinia()] } })
    await wrapper.vm.$nextTick()

    const navbar = wrapper.findComponent(Navbar)
    expect(navbar.exists()).toBe(true)
    expect(navbar.props('unread')).toBe(1)

    await navbar.vm.$emit('toggle-notifications')
    await wrapper.vm.$nextTick()

    const panel = wrapper.findComponent(NotificationsPanel)
    expect(panel.exists()).toBe(true)
    expect(panel.props('show')).toBe(true)

    const saved = JSON.parse(localStorage.getItem('jr_notifications'))
    expect(Array.isArray(saved)).toBe(true)
    expect(saved.length).toBe(2)
    expect(saved.every((n) => n.read === true)).toBe(true)

    wrapper.unmount()
  })
})
