import type { Config } from 'vike/types';
// import vikeVue from 'vike-vue/config';
// import { onRenderClient } from '../renderer/+onRenderClient.ts'; //  with { type: 'pointer' };

export default {
  ssr: false,
  prerender: {
    enable: true,
    parallel: 2,
    keepDistServer: false,
  },
  clientRouting: true,
  prefetchStaticAssets: 'viewport',
  passToClient: ['Page', 'pageProps', /* 'urlPathname', */ 'routeParams'],
  meta: {
    title: {
      // Make the value of `title` available on both the server- and client-side
      env: { server: true, client: true },
    },
    description: {
      // Make the value of `description` available only on the server-side
      env: { server: true },
    },
  },
} satisfies Config;

/*

export default {
  // extends: vikeVue,
//   clientRouting: true,
/!*
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true, client: true },
    },
  },
*!/
  // onRenderClient: import ('../renderer/+onRenderClient.ts'),
  // onRenderHtml: import ('../renderer/+onRenderHtml.ts'),
  // onRenderClient,
  ssr: false,
  prerender: {
    enable: true,
    parallel: 2,
    keepDistServer: false,
  },
/!*
  prerender: {
    // default values.
    partial: false,
    noExtraDir: false,
    // parallel: os.cpus.length, // Number of CPUs
    disableAutoRun: false,
    enable: true,
    keepDistServer: false,
  },
*!/
} satisfies Config
*/
