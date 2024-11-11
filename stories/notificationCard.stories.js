/**
 * @summary story of NotFoundCard
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import NotificationCard from '@/components/Cards/NotificationCard.vue';
import { errorMessage, infoMessage, successMessage, warningMessage } from '@/factories/notificationFactory';

const infoMsg = infoMessage('News Available', 'New Feature available please read the blog.');
const successMsg = successMessage('Saved Succesfully','Your changes have been saved.');
const warnMsg = warningMessage('Keywords warning','Error while processing keywords: Network Error.');
const errorMsg = errorMessage('Keywords Error',
  'Error while processing keywords: Network Error.',
  'TypeError: Cannot read properties of undefined (reading \'type\') at Proxy._sfc_render (http://localhost:8080/src/components/Cards/NotificationCard.vue?t=1712063263205:86:30) at renderComponentRoot (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:2570:17) at ReactiveEffect.componentUpdateFn [as fn] (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7682:46) at ReactiveEffect.run (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:657:19) at instance.update (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7813:17) at setupRenderEffect (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7823:5) at mountComponent (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7591:7) at processComponent (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7545:9) at patch (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7011:11) at patchKeyedChildren (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?');

export default {
  title: '3 Cards / Notification Card',
  component: NotificationCard,
};

export const Empty = {
  args: {},
}

export const Info = {
  args: {
    notification: infoMsg,
  },
}

export const Successfull = {
  args: {
    notification: successMsg,
  },
}

export const Warning = {
  args: {
    notification: warnMsg,
  },
}

export const Error = {
  args: {
    notification: errorMsg,
  },
}

