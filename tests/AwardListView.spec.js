

// @vitest-environment jsdom
// Inicializar jsdom antes de cualquier import Vue

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AwardListView from '../views/modules/AwardListView.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useAwardStore } from '../stores/modules/award';
import { nextTick } from 'vue';

describe('AwardListView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const store = useAwardStore();
    store.items = [];
    store.loading = false;
    store.error = null;
    // Mock fetchAll para que no cambie el estado en el montaje
    store.fetchAll = vi.fn();
  });

  it('renders awards table', async () => {
    const store = useAwardStore();
    store.items = [
      { id: 1, name: 'Premio Test' },
      { id: 2, name: 'Premio 2' },
    ];
    store.loading = false;
    store.error = null;
    const wrapper = mount(AwardListView);
    await nextTick();
    expect(wrapper.text()).toContain('Premio Test');
    expect(wrapper.text()).toContain('Premio 2');
  });

  it('shows loading state', async () => {
    const store = useAwardStore();
    store.loading = true;
    store.error = null;
    store.items = [];
    const wrapper = mount(AwardListView);
    await nextTick();
    expect(wrapper.text()).toContain('Cargando...');
  });

  it('shows error state', async () => {
    const store = useAwardStore();
    store.loading = false;
    store.error = 'Error!';
    store.items = [];
    const wrapper = mount(AwardListView);
    await nextTick();
    expect(wrapper.text()).toContain('Error!');
    // No debe mostrar la tabla ni los items
    expect(wrapper.text()).not.toContain('Premio Test');
  });
});
