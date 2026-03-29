

// @vitest-environment jsdom
// Inicializar jsdom antes de cualquier import Vue

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ResourceListView from '../views/ResourceListView.vue';
import { createPinia } from 'pinia';

describe('ResourceListView', () => {
  // Mock localStorage para entorno de test
  beforeEach(() => {
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  });
  it('renderiza la tabla de recursos', async () => {
    const pinia = createPinia();
    // Mockear el store para que tenga items
    const { useResourceStore } = await import('../stores/resource');
    const store = useResourceStore(pinia);
    store.items = [{ id: 1, name: 'Test' }];
    store.fetchAll = () => {};
    const wrapper = mount(ResourceListView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.text()).toContain('Recursos');
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('tbody tr').exists()).toBe(true);
  });
});
