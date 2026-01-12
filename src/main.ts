import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  const vuetify = createVuetify({
    components,
    directives,
  });

  app.use(vuetify);

  app.mount('#app');
}

bootstrap();
