import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const apiMock = { post: vi.fn() }
vi.mock('../services/api', () => ({ default: apiMock }))

describe('Education store import actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.post.mockReset()
  })

  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('calls /education/import for URL import', async () => {
    apiMock.post.mockResolvedValue({})
    const mod = await import('../stores/modules/education')
    const { useEducationStore } = mod
    const store = useEducationStore()

    await store.importFromUrl('http://example.com/resume.pdf')

    expect(apiMock.post).toHaveBeenCalledWith('/import/education', { url: 'http://example.com/resume.pdf' })
  })

  it('falls back to /import/resume when /education/import fails', async () => {
    apiMock.post.mockImplementation((path, data) => {
      if (path === '/import/education') return Promise.reject({ response: { data: { message: 'not found' } } })
      if (path === '/import/resume') return Promise.resolve({})
      return Promise.reject(new Error('unexpected'))
    })

    const mod = await import('../stores/modules/education')
    const store = mod.useEducationStore()

    await store.importFromUrl('http://example.com/resume.pdf')

    expect(apiMock.post).toHaveBeenCalledWith('/import/education', { url: 'http://example.com/resume.pdf' })
    expect(apiMock.post).toHaveBeenCalledWith('/import/resume', { url: 'http://example.com/resume.pdf' })
  })

  it('uploads file to /education/import as multipart/form-data', async () => {
    apiMock.post.mockResolvedValue({})
    const mod = await import('../stores/modules/education')
    const store = mod.useEducationStore()
    const file = { name: 'resume.pdf' }

    await store.importFile(file)

    expect(apiMock.post).toHaveBeenCalled()
    const call = apiMock.post.mock.calls[0]
    expect(call[0]).toBe('/import/education')
    expect(call[2]).toEqual(expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }))
  })
})