import type { Config } from 'vike/types';

export default {
  clientRouting: true,
  prerender: true,
  // Pre-rendeer settings.
  // The following are the default values.
/*
  prerender: {
    partial: false,
    noExtraDir: false,
    // parallel: os.cpus.length, // Number of CPUs
    disableAutoRun: false,
    enable: true,
    keepDistServer: false,
  },
*/
  filesystemRoutingRoot: 'src/modules/components/',
} satisfies Config
