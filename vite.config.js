/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/dist/config';
import eslint from 'vite-plugin-eslint';
import Unfonts from 'unplugin-fonts/vite'
import { visualizer } from 'rollup-plugin-visualizer';

import { getFilesWithPrefix } from './src/factories/enhancementsFactoryNode';

const version = process.env.npm_package_version;


export default ({ mode }) => {
    const isProd = mode === 'production'

    if (isProd) {
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
            console.log(`Created version file ${fileName} for easy build version highlight.`);
        } catch (err) {
            console.log(`Tried to created file ${fileName}. Error: ${err}`);
        }
    }

    const env = loadEnv(mode, process.cwd())
    console.log(`With VITE_USE_TESTDATA: ${env.VITE_USE_TESTDATA}`);
    console.log(`With VITE_CONFIG_URL: ${env.VITE_CONFIG_URL}`);
    console.log(`With VITE_API_ROOT: ${env.VITE_API_ROOT}`);
    console.log(`With VITE_API_BASE_URL: ${env.VITE_API_BASE_URL}`);
    console.log(`With VITE_API_DOI_BASE_URL: ${env.VITE_API_DOI_BASE_URL}`);
    console.log(`With VITE_BUILD_SOURCEMAPS: ${env.VITE_BUILD_SOURCEMAPS}`);
    console.log(`starting ${mode} | version: ${version} | prod: ${isProd}`);

    const buildSourceMaps = env.VITE_BUILD_SOURCEMAPS === 'true'

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
        resolve: {
            alias: [
              { find: '@', replacement: path.resolve(__dirname, 'src') },
              { find: '~', replacement: path.resolve(__dirname) },
              { find: 'leaflet/dist/leaflet.css', replacement: 'leaflet/dist/leaflet.css' },
              { find: 'leaflet', replacement: 'leaflet/dist/leaflet.js' },
              { find: 'leaflet.markercluster/dist/MarkerCluster.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.css' },
              { find: 'leaflet.markercluster/dist/MarkerCluster.Default.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.Default.css' },
              { find: 'leaflet.markercluster', replacement: 'leaflet.markercluster/dist/leaflet.markercluster.js' },
              { find: 'vue', replacement: 'vue/dist/vue.esm-bundler.js' },
            ],
        },
        build: {
          assetsDir: './static',
          chunkSizeWarningLimit: 500,
          assetsInlineLimit: 4096 / 2, // Reduce the amount of image inlining so the chunks don't get huge
          cssCodeSplit: true,
          minify: !buildSourceMaps,
          sourcemap: buildSourceMaps,
          emptyOutDir: true,
          rollupOptions: isProd ? {
            output: {
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
                if (id.includes('src/modules/about')) {
                  return 'envidat_about';
                }
                if (id.includes('src/modules/blog')) {
                  return 'envidat_blog';
                }
                if (id.includes('src/modules/browse')) {
                  return 'envidat_browse';
                }
                if (id.includes('src/modules/home')) {
                  return 'envidat_home';
                }
                if (id.includes('src/modules/integration')) {
                  return 'envidat_integration';
                }
                if (id.includes('src/modules/metadata')) {
                  return 'envidat_metadata';
                }
                if (id.includes('src/modules/organizations')) {
                  return 'envidat_organizations';
                }
                if (id.includes('src/modules/projects')) {
                  return 'envidat_projects';
                }
                if (id.includes('src/modules/services')) {
                  return 'envidat_services';
                }
                if (id.includes('src/modules/user')) {
                  return 'envidat_user';
                }
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
                if (id.includes('uppy') || id.includes('exifr')) {
                  return 'vendor_uppy';
                }
                if (id.includes('core-js')) {
                  return 'vendor_core_js';
                }
                if (id.includes('lodash')) {
                  return 'vendor_lodash';
                }
                if (id.includes('tokenize')) {
                  return 'vendor_tokenize';
                }
                if (id.includes('micromark') || id.includes('remark') || id.includes('markdown') || id.includes('mdast-util') || id.includes('hast-util') || id.includes('unist-util')) {
                  return 'vendor_markdown';
                }

                // all other node_modules
                if (id.includes('node_modules')) {
                  return 'vendors';
                }

                return undefined;
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
