import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock the auth store module at top level so services/api dynamic import picks it up
const refreshTokenMock = vi.fn()
const fakeStore = () => ({ token: 'old-token', isTokenExpiringSoon: () => true, refreshToken: refreshTokenMock })
vi.mock('../stores/auth', () => ({ useAuthStore: fakeStore }))

import api from '../services/api'

describe('API request interceptor', () => {
  beforeEach(() => {
    refreshTokenMock.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('calls refreshToken when token is expiring soon and attaches Authorization header', async () => {
    // find the registered request interceptor handler
    const handler = api.interceptors.request.handlers.find(h => !!h.fulfilled).fulfilled
    const config = { url: '/some/resource', headers: {} }
    const result = await handler(config)
    expect(refreshTokenMock).toHaveBeenCalled()
    expect(result.headers.Authorization).toBe('Bearer old-token')
  })

  it('does not call refreshToken for auth endpoints', async () => {
    const handler = api.interceptors.request.handlers.find(h => !!h.fulfilled).fulfilled
    const config = { url: '/authentication/refresh-token', headers: {} }
    refreshTokenMock.mockReset()
    const result = await handler(config)
    expect(refreshTokenMock).not.toHaveBeenCalled()
    // still attaches header from current token
    expect(result.headers.Authorization).toBe('Bearer old-token')
  })
})
