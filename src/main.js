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
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
// import InfiniteLoading from 'vue-infinite-loading';

import store from '@/store/store';
import App from '@/App.vue';
import { initAxios } from '@/init';

import vuetify from '@/plugins/vuetify';
import router from '@/router';

const app = createApp(App);
const pinia = createPinia();

initAxios(app, store);

app
  .use(vuetify)
  .use(router)
  .use(store)
  .use(pinia)
  //  .use(InfiniteLoading)
  .mount('#app');
