import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { createI18n } from 'vue-i18n';
import messages from './locales';

const i18n = createI18n({
	legacy: false,
	locale: 'es',
	fallbackLocale: 'en',
	messages,
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');
