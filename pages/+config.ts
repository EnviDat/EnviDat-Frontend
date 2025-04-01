import type { Config } from 'vike/types';
import vikeVue from 'vike-vue/config';

export default {
/*
  clientRouting: true,
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true, client: true },
    },
  },
*/
  prerender: {
    enable: true,
    keepDistServer: false,
  },
/*
  prerender: {
    // default values.
    partial: false,
    noExtraDir: false,
    // parallel: os.cpus.length, // Number of CPUs
    disableAutoRun: false,
    enable: true,
    keepDistServer: false,
  },
*/
  extends: vikeVue,
} satisfies Config
