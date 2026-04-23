import { vi } from 'vitest';
let backendAwards = [
  { id: 1, name: 'Premio Test' },
];
vi.mock('../../services/api', () => {
  return {
    default: {
      get: async () => {
        console.log('[MOCK API] GET /award', backendAwards);
        return { data: { data: backendAwards.slice() } };
      },
      post: async (url, data) => {
        const newId = backendAwards.length ? Math.max(...backendAwards.map(a => a.id)) + 1 : 1;
        const newAward = { id: newId, ...data };
        backendAwards.push(newAward);
        console.log('[MOCK API] POST /award', newAward);
        return { data: newAward };
      },
      patch: async (url, data) => {
        const id = parseInt(url.split('/').pop());
        const idx = backendAwards.findIndex(a => a.id === id);
        if (idx !== -1) backendAwards[idx] = { ...backendAwards[idx], ...data };
        console.log('[MOCK API] PATCH /award', backendAwards[idx]);
        return { data: backendAwards[idx] };
      },
      delete: async (url) => {
        const id = parseInt(url.split('/').pop());
        backendAwards = backendAwards.filter(a => a.id !== id);
        console.log('[MOCK API] DELETE /award', id);
        return { data: null };
      },
    },
  };
});
import { describe, it, expect, beforeEach } from 'vitest';
import flushPromises from 'flush-promises';
import { setActivePinia, createPinia } from 'pinia';

describe('Award Store', () => {
  let pinia;
  let useAwardStore;
  let mockApi;
  beforeEach(async () => {
    backendAwards = [
      { id: 1, name: 'Premio Test' },
    ];
    mockApi = {
      get: async () => ({ data: { data: backendAwards.slice() } }),
      post: async (url, data) => {
        const newId = backendAwards.length ? Math.max(...backendAwards.map(a => a.id)) + 1 : 1;
        const newAward = { id: newId, ...data };
        backendAwards.push(newAward);
        return { data: newAward };
      },
      patch: async (url, data) => {
        const id = parseInt(url.split('/').pop());
        const idx = backendAwards.findIndex(a => a.id === id);
        if (idx !== -1) backendAwards[idx] = { ...backendAwards[idx], ...data };
        return { data: backendAwards[idx] };
      },
      delete: async (url) => {
        const id = parseInt(url.split('/').pop());
        backendAwards = backendAwards.filter(a => a.id !== id);
        return { data: null };
      },
    };
    pinia = createPinia();
    setActivePinia(pinia);
    const mod = await import('../stores/modules/award');
    useAwardStore = mod.createAwardStore(mockApi);
  });

  it('fetches all awards', async () => {
    const store = useAwardStore(pinia);
    expect(store.items).toEqual([]);
    await store.fetchAll();
    await flushPromises();
    expect(store.items).toEqual([
      { id: 1, name: 'Premio Test' },
    ]);
    expect(store.error).toBeNull();
  });

  it('creates an award', async () => {
    const store = useAwardStore(pinia);
    await store.create({ name: 'Nuevo Premio' });
    await flushPromises();
    expect(store.error).toBeNull();
    expect(store.items).toEqual([
      { id: 1, name: 'Premio Test' },
      { id: 2, name: 'Nuevo Premio' },
    ]);
  });

  it('updates an award', async () => {
    const store = useAwardStore(pinia);
    await store.create({ name: 'Nuevo Premio' });
    await flushPromises();
    await store.update(1, { name: 'Premio Editado' });
    await flushPromises();
    expect(store.error).toBeNull();
    expect(store.items).toEqual([
      { id: 1, name: 'Premio Editado' },
      { id: 2, name: 'Nuevo Premio' },
    ]);
  });

  it('removes an award', async () => {
    const store = useAwardStore(pinia);
    await store.create({ name: 'Nuevo Premio' });
    await flushPromises();
    await store.remove(1);
    await flushPromises();
    expect(store.error).toBeNull();
    expect(store.items).toEqual([
      { id: 2, name: 'Nuevo Premio' },
    ]);
  });
});
