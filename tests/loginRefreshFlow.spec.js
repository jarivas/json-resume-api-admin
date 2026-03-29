import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import api from '../services/api'

describe('Login + auto-refresh integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('logs in, refreshes token automatically and attaches refreshed token to requests', async () => {
    // Spy on api.post to simulate backend login and refresh
    const now = Date.now()
    const loginExpires = now + 2000 // short-lived token (2s)
    const refreshExpires = now + 5 * 60 * 1000

    const postSpy = vi.spyOn(api, 'post').mockImplementation((url, data) => {
      if (url.includes('/authentication/login')) {
        return Promise.resolve({ data: { token: 't1', expiresAt: loginExpires, user: { id: 1 } } })
      }
      if (url.includes('/authentication/refresh')) {
        return Promise.resolve({ data: { token: 't2', expiresAt: refreshExpires } })
      }
      return Promise.resolve({ data: {} })
    })

    // Spy on api.get to capture headers passed in config
    let capturedConfig = null
    const getSpy = vi.spyOn(api, 'get').mockImplementation((url, config) => {
      capturedConfig = config || {}
      return Promise.resolve({ data: { ok: true } })
    })

    const mod = await import('../stores/auth')
    const useAuthStore = mod.useAuthStore
    const store = useAuthStore()

    // perform login
    await store.login('a@b.com', 'pass')

    // Wait a short tick to let any immediate scheduled refresh (delay 0) run
    await new Promise((r) => setTimeout(r, 20))

    // refresh should have been called and token updated to t2
    expect(postSpy).toHaveBeenCalled()
    expect(store.token).toBe('t2')

    // verify the request interceptor attaches the refreshed token to outgoing requests
    const handler = api.interceptors.request.handlers.find(h => !!h.fulfilled).fulfilled
    const cfg = await handler({ url: '/protected', headers: {} })
    expect(cfg.headers.Authorization).toBe('Bearer t2')

    postSpy.mockRestore()
    getSpy.mockRestore()
  })
})
