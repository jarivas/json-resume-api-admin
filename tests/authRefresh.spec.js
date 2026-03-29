import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// top-level mock object for the api module
const apiMock = { post: vi.fn() }
vi.mock('../services/api', () => ({ default: apiMock }))


describe('Auth store token refresh', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    apiMock.post.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('refreshToken updates token and expiresAt and schedules timer', async () => {
    const future = Date.now() + 5 * 60 * 1000 // 5 minutes from now
    apiMock.post.mockResolvedValue({ data: { token: 'new-token', expiresAt: future } })

    const mod = await import('../stores/auth')
    const useAuthStore = mod.useAuthStore
    const store = useAuthStore()

    // ensure cleared initial token
    store.token = ''

    // call refresh
    await store.refreshToken()

    expect(apiMock.post).toHaveBeenCalledWith('/authentication/refresh-token')
    expect(store.token).toBe('new-token')
    expect(store.expiresAt).toBe(future)
    // timer id should be set (not null)
    expect(store._refreshTimerId).not.toBeNull()
  })

  it('refreshToken logs out on failure', async () => {
    apiMock.post.mockRejectedValue(new Error('network'))

    const mod = await import('../stores/auth')
    const useAuthStore = mod.useAuthStore
    const store = useAuthStore()

    // set token so logout will clear it
    store.token = 'old'
    try {
      await store.refreshToken()
    } catch (e) {
      // expected
    }
    expect(store.token).toBe('')
    expect(store.expiresAt).toBe(0)
  })
})
