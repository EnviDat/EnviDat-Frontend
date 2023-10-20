import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue2';

import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/dist/config.cjs';
import eslint from 'vite-plugin-eslint';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import ViteWebfontDownload from 'vite-plugin-webfont-dl'
import { visualizer } from 'rollup-plugin-visualizer';

import { getFilesWithPrefix } from './src/factories/enhancementsFactoryNode';

const version = process.env.npm_package_version;

export default ({ mode, config }) => {
    const isProd = mode === 'production'

    const fileName = `version_${version}.txt`;
    const existingFilePaths = path.resolve(__dirname, 'public/');

    const existingVersionFiles = getFilesWithPrefix(existingFilePaths, 'version_');

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
        console.log(`Created version file ${fileName} for easy build version highlight in ${filePath}`);
    } catch (err) {
        console.log(`Tried to created file ${fileName} in ${filePath}. Error: ${err}`);
    }

    const env = loadEnv(mode, process.cwd())
    console.log(`With VITE_USE_TESTDATA: ${env.VITE_USE_TESTDATA}`);
    console.log(`With VITE_CONFIG_URL: ${env.VITE_CONFIG_URL}`);
    console.log(`With VITE_API_ROOT: ${env.VITE_API_ROOT}`);
    console.log(`With VITE_API_BASE_URL: ${env.VITE_API_BASE_URL}`);
    console.log(`With VITE_API_DOI_BASE_URL: ${env.VITE_API_DOI_BASE_URL}`);
    console.log(`starting ${mode} | version: ${version} | prod: ${isProd}`);


    return defineConfig({
        plugins: [
          vue(),
          eslint({
            exclude: ['/virtual:/**', 'node_modules/**'],
          }),
          ViteRequireContext(),
          Components({
              resolvers: [
                // Vuetify
                VuetifyResolver(),
              ],
          }),
          ViteWebfontDownload(
            ['https://fonts.googleapis.com/css2?family=Baskervville&family=Raleway:wght@400;500;700&display=swap'],
            {
              injectAsStyleTag: true,
              minifyCss: true,
              async: true,
              cache: true,
              proxy: false,
            },
          ),
          visualizer({
            filename: './dist/buildStats.html',
            title : 'EnviDat Build Visualizer',
          }),
        ],
        test: {
          exclude: [
            ...configDefaults.exclude,
            './tests/unit/ckanRegression.spec.js',
          ],
        },
        define: {
            'process.env': loadEnv(mode, process.cwd()),
          'import.meta.env.VITE_VERSION': JSON.stringify(version),
        },
        optimizeDeps: {
          include: ['vuetify'],
        },
        base: './',
        // runtimeCompiler: true,
        resolve: {
            alias: [
                // 'vue': path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js'),
              { find: '@', replacement: path.resolve(__dirname, 'src') },
              { find: '~', replacement: path.resolve(__dirname) },
              { find: '@turf/turf', replacement: '@turf/turf/dist/es/index.js' },
              { find: 'turf-jsts', replacement: 'turf-jsts/jsts.min.js' },
              { find: 'leaflet/dist/leaflet.css', replacement: 'leaflet/dist/leaflet.css' },
              { find: 'leaflet', replacement: 'leaflet/dist/leaflet.js' },
              { find: 'leaflet.markercluster/dist/MarkerCluster.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.css' },
              { find: 'leaflet.markercluster/dist/MarkerCluster.Default.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.Default.css' },
              { find: 'leaflet.markercluster', replacement: 'leaflet.markercluster/dist/leaflet.markercluster.js' },
              { find: 'vue', replacement: `vue/dist/vue.${ isProd ? 'min' : 'esm' }.js` },
            ],
        },
        build: {
          assetsDir: './static',
          chunkSizeWarningLimit: 500,
          cssCodeSplit: true,
          minify: isProd,
          sourcemap: !isProd,
          emptyOutDir: true,
          rollupOptions: isProd ? {
            output: {
              // eslint-disable-next-line consistent-return
              manualChunks: (id) => {
                if (id.includes('skeleton-placeholder')) {
                  return 'vendor_skeleton';
                }
/*
                Had to be removed, it caused import errors, when the vendor_leaflet.js tried
                to import something from the vendors.js
                if (id.includes('leaflet')) {
                  return 'vendor_leaflet';
                }
*/
                if (id.includes('src/factories')) {
                  return 'envidat_factories';
                }
                if (id.includes('vuetify')) {
                  return 'vendor_vuetify';
                }
                if (id.includes('vue-router')) {
                  return 'vendor_vue-router';
                }
                if (id.includes('vuex')) {
                  return 'vendor_vuex';
                }
                if (id.includes('vue') && !id.includes('.vue')) {
                  return 'vendor_vue';
                }
                if (id.includes('turf')) {
                  return 'vendor_turf';
                }
                if (id.includes('axios')) {
                  return 'vendor_axios';
                }
                if (id.includes('date-fns')) {
                  return 'vendor_date_fns';
                }
                if (id.includes('yup')) {
                  return 'vendor_yup';
                }
                if (id.includes('amchart') || id.includes('uplot')) {
                  return 'vendor_charts';
                }
                if (id.includes('uppy')) {
                  return 'vendor_uppy';
                }
                if (id.includes('core-js')) {
                  return 'vendor_core_js';
                }

                // all other node_modules
                if (id.includes('node_modules')) {
                  return 'vendors';
                }
              },
            },
          } : {},
          define: {
            'import.meta.env.VITE_VERSION': JSON.stringify(version),
          },
        },
        server: {
            host: '0.0.0.0',
            port: 8080,
        },
    });
}

// {
//     from: 'node_modules/amcharts3/amcharts/images', to: 'amcharts/images',
//   }],
