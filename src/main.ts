import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { vuetify } from '@/utils/vuetify';

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());

  app.use(router);
  app.use(vuetify);
  app.use(createPinia());

  app.mount('#app');
}

bootstrap();
