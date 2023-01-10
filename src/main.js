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

import Vue from 'vue';

import Vue2Filters from 'vue2-filters';
import InfiniteLoading from 'vue-infinite-loading';

import store from '@/store/store';
import App from '@/App.vue';
import { initAxios, initOtel } from '@/init';

import vuetify from './plugins/vuetify';
import router from './router';
import globalMethods from './factories/globalMethods';

Vue.use(InfiniteLoading /* , { options } */);
Vue.use(Vue2Filters);
Vue.config.productionTip = false;
Vue.mixin(globalMethods);

initAxios(Vue, store);

const otelUrl = process.env.VITE_OTEL_ENDPOINT;
if (otelUrl !== 'NULL') {
  initOtel(otelUrl);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>',
});
