/* eslint-disable no-console */

import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vike from 'vike/plugin'

export default async ({ mode, config }) => {

  const isProd = mode === 'production';
  const isDev = mode === 'development';


  return defineConfig({
    plugins: [
      vike(),
      vue(),
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
    base: isProd ? 'https://s3-zh.os.switch.ch/frontend-static/static_datasets/' : '/',
    build: {
      assetsDir: '/static',

      chunkSizeWarningLimit: 500,
      //         assetsInlineLimit: 4096 / 2, // Reduce the amount of image inlining so the chunks don't get huge
      cssCodeSplit: true,
      // minify: !buildSourceMaps,
      // sourcemap: buildSourceMaps,
      emptyOutDir: true,
    },
  });
}
