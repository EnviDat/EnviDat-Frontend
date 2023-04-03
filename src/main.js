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
import InfiniteLoading from 'vue-infinite-loading';

import store from '@/store/store';
import App from '@/App.vue';
import { initAxios } from '@/init';

import msalPlugin from '@/plugins/msalPlugin';
import vuetify from './plugins/vuetify';
import router from './router';
import globalMethods from './factories/globalMethods';

const msalConfig = {
  auth: {
    clientId: '4cb09289-cbb9-48a3-bb16-87ef3508bad3',
    authority: 'https://login.microsoftonline.com/5d407ffa-9961-403b-ab1f-6e7867089add',
    redirect_uri: '/',
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  mode: 'popup',
}

Vue.use(InfiniteLoading /* , { options } */);
Vue.use(msalPlugin, msalConfig);
Vue.config.productionTip = false;
Vue.mixin(globalMethods);
Vue.directive('hide', {
  // Run on initialisation (first render) of the directive on the element
  bind: (el, binding) => {el.style.visibility = (binding.value) ? 'hidden' : ''},
  // Run on subsequent updates to the value supplied to the directive
  update: (el, binding) => {el.style.visibility = (binding.value) ? 'hidden' : ''},
})

initAxios(Vue, store);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>',
});
