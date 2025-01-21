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

import store from '@/store/store';
import App from '@/App.vue';
import { initAxios } from '@/init';

import vuetify from '@/plugins/vuetify';
import router from '@/router';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import VueMatomo from 'vue-matomo';


const app = createApp(App);
const pinia = createPinia();

initAxios(app, store);

const siteMatomoId = process.env.VITE_MATOMO_SITEID

// matomo part to manage the refresh issue
if (localStorage.getItem('matomoConsentGiven') === 'true') {
  /* eslint-disable no-underscore-dangle */
  window._paq = window._paq || [];
  window._paq.push(['rememberConsentGiven']);
  /* eslint-enable no-underscore-dangle */
}


app
  .use(store)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .use(VueVirtualScroller)
  .use(VueMatomo, {
    // Configure your Matomo server and site by providing:
    host: 'https://statistics.wsl.ch/',
    siteId: siteMatomoId,
    router,
    enableLinkTracking: true,
    requireConsent: true,
    trackInitialView: true,
    disableCookies: false,
    enableHeartBeatTimer: true,
    heartBeatTimerInterval: 15,
    // set to false as soon as finish the test
    debug: false,
  })

  .mount('#app');

