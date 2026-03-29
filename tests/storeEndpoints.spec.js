import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock api module used by stores
const apiMock = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }
vi.mock('../services/api', () => ({ default: apiMock }))

describe('Store endpoint coverage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.get.mockReset()
    apiMock.post.mockReset()
    apiMock.patch.mockReset()
    apiMock.delete.mockReset()
  })

  const mapping = {
    basic: { path: '/basic' },
    award: { path: '/award' },
    publication: { path: '/publication' },
    project: { path: '/project' },
    language: { path: '/language' },
    reference: { path: '/reference' },
    skill: { path: '/skill' },
    volunteer: { path: '/volunteer' },
    work: { path: '/work' },
    certificate: { path: '/certificate' },
    education: { path: '/education' },
    interest: { path: '/interest' },
  }

  for (const [key, info] of Object.entries(mapping)) {
    it(`store ${key} should call correct endpoints`, async () => {
      const mod = await import(`../stores/modules/${key}.js`)
      // Determine store creator or useXStore
      const useFn = mod[`use${key.charAt(0).toUpperCase() + key.slice(1)}Store`] || Object.values(mod).find(f => typeof f === 'function' && f.name.startsWith('use'))
      let store
      if (typeof useFn === 'function') {
        store = useFn()
      }
      if (!store) {
        const exportedFn = Object.values(mod).find(f => typeof f === 'function' && (/create/i.test(f.name) || f.name.toLowerCase().includes(key)))
        if (exportedFn) store = exportedFn()
      }

      // call fetchAll -> should call get
      if (typeof store.fetchAll === 'function') {
        await store.fetchAll()
        expect(apiMock.get).toHaveBeenCalled()
        // basic assertion that url contains the path
        expect(apiMock.get.mock.calls[0][0]).toContain(info.path)
      }

      // call create -> should call post
      if (typeof store.create === 'function') {
        apiMock.post.mockResolvedValue({ data: {} })
        await store.create({ test: true })
        expect(apiMock.post).toHaveBeenCalled()
        expect(apiMock.post.mock.calls[0][0]).toContain(info.path)
      }
    })
  }
})
