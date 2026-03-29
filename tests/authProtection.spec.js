

// @vitest-environment jsdom
// Inicializar jsdom antes de cualquier import Vue

import { describe, it, expect, beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import App from '../app.vue';
import LoginView from '../views/LoginView.vue';
import ResourceListView from '../views/ResourceListView.vue';
import { useAuthStore } from '../stores/auth';

// Helper para crear router con rutas protegidas
function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/login', name: 'login', component: LoginView },
      { path: '/', name: 'resources', component: ResourceListView },
    ],
  });
}

describe('Protección de rutas', () => {
  let pinia;
  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  });

  it('redirige a login si no está autenticado', async () => {
    const router = makeRouter();
    router.beforeEach((to, from, next) => {
      const auth = useAuthStore();
      if (to.name !== 'login' && !auth.token) {
        next({ name: 'login' });
      } else {
        next();
      }
    });
    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: { plugins: [pinia, router] },
    });
    expect(router.currentRoute.value.name).toBe('login');
    expect(wrapper.html()).toContain('Iniciar sesión');
  });

  it('permite acceso a recursos si está autenticado', async () => {
    const router = makeRouter();
    router.beforeEach((to, from, next) => {
      const auth = useAuthStore();
      if (to.name !== 'login' && !auth.token) {
        next({ name: 'login' });
      } else {
        next();
      }
    });
    const auth = useAuthStore();
    auth.token = 'fake-token';
    router.push('/');
    await router.isReady();
    const wrapper = mount(App, {
      global: { plugins: [pinia, router] },
    });
    expect(router.currentRoute.value.name).toBe('resources');
    expect(wrapper.html()).toContain('Recursos');
  });
});
