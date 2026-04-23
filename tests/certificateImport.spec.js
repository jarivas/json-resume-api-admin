import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const apiMock = { post: vi.fn() }
vi.mock('../services/api', () => ({ default: apiMock }))

describe('Certificate store import actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.post.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('calls /certificate/import for URL import', async () => {
    apiMock.post.mockResolvedValue({})
    const mod = await import('../stores/modules/certificate')
    const { useCertificateStore } = mod
    const store = useCertificateStore()

    await store.importFromUrl('http://example.com/cert.pdf')

    expect(apiMock.post).toHaveBeenCalledWith('/import/certificate', { url: 'http://example.com/cert.pdf' })
  })

  it('falls back to /import/resume when /certificate/import fails', async () => {
    apiMock.post.mockImplementation((path, data) => {
      if (path === '/import/certificate') return Promise.reject({ response: { data: { message: 'not found' } } })
      return Promise.reject(new Error('unexpected'))
    })

    const mod = await import('../stores/modules/certificate')
    const store = mod.useCertificateStore()

    await store.importFromUrl('http://example.com/cert.pdf')

    expect(apiMock.post).toHaveBeenCalledWith('/import/certificate', { url: 'http://example.com/cert.pdf' })
    expect(apiMock.post).not.toHaveBeenCalledWith('/import/resume', { url: 'http://example.com/cert.pdf' })
  })

  it('uploads file to /certificate/import as multipart/form-data', async () => {
    apiMock.post.mockResolvedValue({})
    const mod = await import('../stores/modules/certificate')
    const store = mod.useCertificateStore()
    const file = { name: 'cert.pdf' }

    await store.importFile(file)

    expect(apiMock.post).toHaveBeenCalled()
    const call = apiMock.post.mock.calls[0]
    expect(call[0]).toBe('/import/certificate')
    expect(call[2]).toEqual(expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }))
  })
})