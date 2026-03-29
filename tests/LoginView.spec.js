


// @vitest-environment jsdom
// Inicializar jsdom antes de cualquier import Vue

import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import LoginView from '../views/LoginView.vue';

beforeEach(() => {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
});

describe('LoginView', () => {
  it('renderiza el formulario de login', () => {
    const pinia = createPinia();
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.text()).toContain('Iniciar sesión');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });
});
