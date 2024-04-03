/**
 * @summary story of NotFoundCard
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import NotificationCard from '@/components/Cards/NotificationCard.vue';

export default {
  title: '3 Cards / Notification Card',
  component: NotificationCard,
};

export const Empty = {
  args: {},
}

export const Info = {
  args: {
    type: 'info',
    message: 'News Available',
    details: 'New Feature available please read the blog',
  },
}

export const Successfull = {
  args: {
    type: 'success',
    message: 'Success Title',
    details: 'Success Message',
  },
}

export const Warning = {
  args: {
    type: 'warning',
    message: 'Keywords Error',
    details: 'Error while processing keywords: Network Error.',
  },
}

export const Error = {
  args: {
    type: 'error',
    message: 'Keywords Error',
    details: 'Error while processing keywords: Network Error.',
    stack: 'TypeError: Cannot read properties of undefined (reading \'type\') at Proxy._sfc_render (http://localhost:8080/src/components/Cards/NotificationCard.vue?t=1712063263205:86:30) at renderComponentRoot (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:2570:17) at ReactiveEffect.componentUpdateFn [as fn] (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7682:46) at ReactiveEffect.run (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:657:19) at instance.update (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7813:17) at setupRenderEffect (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7823:5) at mountComponent (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7591:7) at processComponent (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7545:9) at patch (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?v=7727faa3:7011:11) at patchKeyedChildren (http://localhost:8080/node_modules/.vite/deps/chunk-C7MOETVJ.js?',
  },
}

