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
import { createPinia, PiniaVuePlugin } from 'pinia';

import VueMatomo from 'vue-matomo';

import store from '@/store/store';
import App from '@/App.vue';
import { initAxios } from '@/init';

import vuetify from './plugins/vuetify';
import router from './router';
import globalMethods from './factories/globalMethods';

Vue.config.productionTip = false;
Vue.mixin(globalMethods);
Vue.directive('hide', {
  // Run on initialisation (first render) of the directive on the element
  bind: (el, binding) => {
    el.style.visibility = binding.value ? 'hidden' : '';
  },
  // Run on subsequent updates to the value supplied to the directive
  update: (el, binding) => {
    el.style.visibility = binding.value ? 'hidden' : '';
  },
});
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.use(VueMatomo, {
  // Configure your Matomo server and site by providing:
  host: 'https://statistics.wsl.ch/',
  siteId: 37,
  router,
  enableLinkTracking: true,
  requireConsent: true,
  trackInitialView: true,
  disableCookies: false,
  enableHeartBeatTimer: true,
  heartBeatTimerInterval: 15,
  // set to false as soon as finish the test
  debug: true,
});

initAxios(Vue, store);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  VueMatomo,
  components: { App },
  template: '<App/>',
  pinia,
});
