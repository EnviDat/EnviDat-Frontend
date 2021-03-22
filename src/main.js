/**
 * The main.js bootstraps all libraries and their dependencies.
 * And creates the Vue instance and mounts it.
 *
 * @summary main.js
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2020-07-15 09:18:26
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import 'babel-polyfill';
import Vue from 'vue';

import axios from 'axios';
import Vue2Filters from 'vue2-filters';
import InfiniteLoading from 'vue-infinite-loading';
import store from '@/store/store';

import {
  handleGenericError,
  handleGenericAPIError,
} from '@/factories/notificationFactory';

// import Vuelidate from 'vuelidate';
import vuetify from './plugins/vuetify';
import router from './router';
import globalMethods from './factories/globalMethods';

import App from './App';


Vue.use(InfiniteLoading /* , { options } */);
Vue.use(Vue2Filters);
Vue.config.productionTip = false;
Vue.mixin(globalMethods);
// Vue.use(Vuelidate);

/* eslint-disable prefer-template */
Vue.config.errorHandler = (err, vm, info) => {
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log('Vue errorHandler ' + err.message + ' \n ' + info + ' \n ' + err.stack);
  handleGenericError(store, err.message, info, err.stack);
};

// Vue.config.warnHandler = function (msg, vm, trace) {
//   // `trace` is the component hierarchy trace
//   console.log('Vue.config.warnHandler vm: ' + vm.$store + ' ' + msg + ' \n\n ' + trace);
//   // vm.$store.commit(ADD_USER_NOTIFICATION, msg + ' ' + trace );
// }

axios.interceptors.response.use(
  // this is called "onFulfilled"
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // console.log('interceptor got ' + response.status);
  response => response,
  (error) => {
    // this is called "onRejected"
    // console.log('interceptor error ' + error);
    if (error.status >= 500) {
      handleGenericAPIError(store, error);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // throw new Error(error);
    return Promise.reject(error);
  },
);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>',
});
