/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/dist/config';
import eslint from 'vite-plugin-eslint';

import Unfonts from 'unplugin-fonts/vite'
import vueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';

import { getFilesWithPrefix } from './src/factories/enhancementsFactoryNode';

const version = process.env.npm_package_version;

export default ({ mode, config }) => {
  const isProd = mode === 'production';

  const fileName = `version_${version}.txt`;
  const existingFilePaths = path.resolve(__dirname, 'public/');

  const existingVersionFiles = getFilesWithPrefix(
    existingFilePaths,
    'version_',
  );

  // delete any existing files with version_ as prefix to make sure only the latest version is created
  for (let i = 0; i < existingVersionFiles.length; i++) {
    const file = existingVersionFiles[i];
    const fullPath = path.resolve(`${existingFilePaths}`, `${file}`);
    console.log(`Going to delete version file: ${fullPath}`);
    fs.unlinkSync(fullPath);
  }

  const filePath = path.resolve(__dirname, 'public/', `${fileName}`);

  try {
    fs.writeFileSync(filePath, version);
    console.log(
      `Created version file ${fileName} for easy build version highlight in ${filePath}`,
    );
  } catch (err) {
    console.log(
      `Tried to created file ${fileName} in ${filePath}. Error: ${err}`,
    );
  }

  const env = loadEnv(mode, process.cwd());
  console.log(`With VITE_USE_TESTDATA: ${env.VITE_USE_TESTDATA}`);
  console.log(`With VITE_CONFIG_URL: ${env.VITE_CONFIG_URL}`);
  console.log(`With VITE_API_ROOT: ${env.VITE_API_ROOT}`);
  console.log(`With VITE_API_BASE_URL: ${env.VITE_API_BASE_URL}`);
  console.log(`With VITE_API_DOI_BASE_URL: ${env.VITE_API_DOI_BASE_URL}`);
  console.log(`With VITE_BUILD_SOURCEMAPS: ${env.VITE_BUILD_SOURCEMAPS}`);
  console.log(`starting ${mode} | version: ${version} | prod: ${isProd}`);

  const buildSourceMaps = env.VITE_BUILD_SOURCEMAPS === 'true';

    return defineConfig({
      plugins: [
          vue(),
          eslint({
            // https://github.com/storybookjs/builder-vite/issues/367#issuecomment-1938214165
            // Remove warnings because Vite falesly tries to lint folders it should not
            exclude: ['/virtual:/**', 'node_modules/**', '/sb-preview/**'],
          }),
          vuetify({
            autoImport: true,
          }),
          Unfonts({
            google: {
              families: [
                'Baskervville',
                {
                  name: 'Raleway',
                  styles: 'wght@400;500;700',
                },
              ],
            },
          }),
        visualizer({
          filename: './dist/buildStats.html',
          title : 'EnviDat Build Visualizer',
        }),
        vueDevTools(),
      ],
      define: {
        'process.env': loadEnv(mode, process.cwd()),
        'import.meta.env.VITE_VERSION': JSON.stringify(version),
      },
      test: {
        exclude: [
          ...configDefaults.exclude,
          './tests/unit/ckanRegression.spec.js',
        ],
      },
      base: './',
      resolve: {
          alias: [
            { find: '@', replacement: path.resolve(__dirname, 'src') },
            { find: '~', replacement: path.resolve(__dirname) },
            // { find: 'leaflet', replacement: 'leaflet/dist/leaflet.js' },
            { find: 'leaflet/dist/leaflet.css', replacement: 'leaflet/dist/leaflet.css' },
            // { find: 'leaflet', replacement: 'leaflet/dist/leaflet-src.esm.js' },
            { find: 'leaflet.markercluster/dist/MarkerCluster.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.css' },
            { find: 'leaflet.markercluster/dist/MarkerCluster.Default.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.Default.css' },
            { find: 'leaflet.markercluster', replacement: 'leaflet.markercluster/dist/leaflet.markercluster.js' },
            { find: 'vue', replacement: 'vue/dist/vue.esm-bundler.js' },
          ],
      },
      build: {
        assetsDir: './static',
        chunkSizeWarningLimit: 500,
//         assetsInlineLimit: 4096 / 2, // Reduce the amount of image inlining so the chunks don't get huge
        cssCodeSplit: true,
        minify: !buildSourceMaps,
        sourcemap: buildSourceMaps,
        emptyOutDir: true,
        rollupOptions: isProd ? {
         output: {
           manualChunks: (id) => {

            if (id.includes('node_modules')) {

              if (id.includes('vuetify')) {
                return 'vendor_vuetify';
              }

              if (id.includes('vue') || id.includes('pinia')) {
                // vue, vuex & pinia, vue-router, etc.
                return 'vendor_vue';
              }

              if (id.includes('leaflet')) {
                return 'vendor_leaflet';
              }

              if (id.includes('turf')) {
                return 'vendor_turf';
              }

              if (id.includes('uppy')) {
                return 'vendor_uppy';
              }

              if (id.includes('chart') || id.includes('uplot')) {
                return 'vendor_charts';
              }

              if (id.includes('yup')) {
                return 'vendor_validation';
              }

              if (id.includes('axios')
                || id.includes('date-fns')
                || id.includes('mitt')
                || id.includes('seedrandom')
                || id.includes('tiny-js-md5')
              ) {
                return 'vendor_utils';
              }

              return 'vendors';
            }

            if (id.includes('src/assets')) {
              return 'envidat_assets';
            }


            // Let Rollup handle the rest
            return undefined
          },
        },
      } : {},
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
      proxy: {
        '/api': {
          target: 'https://statistics.wsl.ch',
          changeOrigin: true,
          rewrite: proxyPath => proxyPath.replace(/^\/api/, ''),
        },
      },
    },
  });
};
