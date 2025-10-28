/* eslint-disable no-console */

import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vike from 'vike/plugin'
import vuetify from 'vite-plugin-vuetify';

export default async ({ mode, config }) => {

  const env = loadEnv(mode, process.cwd());

  console.log(`Start ${mode} vike build with:`);
  console.log(`With VITE_USE_TESTDATA: ${env.VITE_USE_TESTDATA}`);
  console.log(`With VITE_CONFIG_URL: ${env.VITE_CONFIG_URL}`);
  console.log(`With VITE_API_ROOT: ${env.VITE_API_ROOT}`);
  console.log(`With VITE_API_BASE_URL: ${env.VITE_API_BASE_URL}`);
  console.log(`With VITE_API_DOI_BASE_URL: ${env.VITE_API_DOI_BASE_URL}`);
  console.log(`With VITE_BUILD_SOURCEMAPS: ${env.VITE_BUILD_SOURCEMAPS}`);
  console.log(`With PUBLIC_ENV__VIKE_BASE_CANONICAL_URL: ${env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL}`);
  console.log(`With VITE_SEO_BASE: ${env.VITE_SEO_BASE}`);

  return defineConfig({
    plugins: [
      vike(),
      vue(),
      vuetify(),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '~', replacement: path.resolve(__dirname) },
        // { find: 'leaflet', replacement: 'leaflet/dist/leaflet.js' },
        {
          find: 'leaflet/dist/leaflet.css',
          replacement: 'leaflet/dist/leaflet.css',
        },
        // { find: 'leaflet', replacement: 'leaflet/dist/leaflet-src.esm.js' },
        {
          find: 'leaflet.markercluster/dist/MarkerCluster.css',
          replacement: 'leaflet.markercluster/dist/MarkerCluster.css',
        },
        {
          find: 'leaflet.markercluster/dist/MarkerCluster.Default.css',
          replacement: 'leaflet.markercluster/dist/MarkerCluster.Default.css',
        },
        {
          find: 'leaflet.markercluster',
          replacement: 'leaflet.markercluster/dist/leaflet.markercluster.js',
        },
        // { find: 'vue', replacement: 'vue/dist/vue.esm-bundler.js' },
      ],
    },
    // base: isProd ? 'https://s3-zh.os.switch.ch/frontend-static/static_datasets/' : '/',
    // base: 'https://s3-zh.os.switch.ch/frontend-static/static_datasets/',
    base: env.VITE_SEO_BASE,
    build: {
      assetsDir: '/static',
      chunkSizeWarningLimit: 500,
      //         assetsInlineLimit: 4096 / 2, // Reduce the amount of image inlining so the chunks don't get huge
      cssCodeSplit: false,
      // minify: !buildSourceMaps,
      // sourcemap: buildSourceMaps,
      emptyOutDir: true,
    },
    ssr: { noExternal: ['vuetify'] },
  });
}
