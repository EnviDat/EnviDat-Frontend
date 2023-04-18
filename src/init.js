/**
 * The init.js holds functions for initialization of the EnviDat app
 *
 * @summary init.js
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-01-06 16:30:10
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package. */

 import axios from 'axios';

import { handleGenericAPIError, handleGenericError } from './factories/notificationFactory';

 export const initAxios = (app, store) => {
   const storeRef = store;

   /* eslint-disable prefer-template */
   app.config.errorHandler = (err, vm, info) => {
     // `info` is a Vue-specific error info, e.g. which lifecycle hook
     // the error was found in. Only available in 2.2.0+
     // console.log('Vue errorHandler ' + err.message + ' \n ' + info + ' \n ' + err.stack);
     const msg = err.message ? err.message : err;
     const errStack = err.stack
       ? err.stack
       : 'No error stack available, please let the envidat team know of this Error!';

     console.error(`err: ${msg} . Error Stack: ${errStack}`);
     
     handleGenericError(storeRef, msg, info, errStack);
   };

 // Vue.config.warnHandler = function (msg, vm, trace) {
 //   // `trace` is the component hierarchy trace
 //   console.log('Vue.config.warnHandler vm: ' + vm.$store + ' ' + msg + ' \n\n ' + trace);
 //   // vm.$store.commit(ADD_USER_NOTIFICATION, msg + ' ' + trace );
 // }

   const excludedDomains = [
     process.env.VITE_ENVIDAT_STATIC_ROOT,
     process.env.VITE_CONFIG_URL,
   ];

   axios.interceptors.request.use(
     config => {
       // Do something before request is sent

       const urlIsExcluded = excludedDomains.some(domain =>
         config.url.includes(domain),
       );

       if (!urlIsExcluded) {
         config.withCredentials = true;
       }

       return config;
     },
     error =>
       // Do something with request error
       Promise.reject(error),
   );

   axios.interceptors.response.use(
     // this is called "onFulfilled"
     // Any status code that lie within the range of 2xx cause this function to trigger
     // Do something with response data
     // console.log('interceptor got ' + response.status);
     response => response,
     error => {
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
 }
