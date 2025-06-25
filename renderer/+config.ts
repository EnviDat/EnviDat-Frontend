import type { Config } from 'vike/types';
import vikeVue from 'vike-vue/config';

export default {
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true, client: true },
    },
  },
  extends: vikeVue,
} satisfies Config
