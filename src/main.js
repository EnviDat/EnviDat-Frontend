/**
 * The main.js bootstraps all libraries and their dependencies.
 * And creates the Vue instance and mounts it.
 *
 * @summary main.js
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-01-06 16:30:10
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package. */

import { createApp } from 'vue';
// import InfiniteLoading from 'vue-infinite-loading';

import App from './App.vue';
import store from '@/store/store';
import router from '@/router';
import vuetify from './plugins/vuetify';
import globalMethods from './factories/globalMethods';
import { initAxios, initOtel } from './init';

const app = createApp(App);

initAxios(app, store);

const otelUrl = process.env.VITE_OTEL_ENDPOINT;
if (otelUrl !== 'NULL') {
  initOtel(otelUrl);
}


app
  .use(vuetify)
  .use(router)
  .use(store)
//  .use(InfiniteLoading)
  .mixin(globalMethods)
  .mount('#app');
