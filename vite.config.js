import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import Unfonts from 'unplugin-fonts/vite'
import { visualizer } from 'rollup-plugin-visualizer';

// import { getFilesWithPrefix } from '@/factories/enhancementsFactoryNode';
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

    console.log(`starting server | version: ${version} | prod: ${isProd}`);


    return defineConfig({
        plugins: [
            vue(),
            eslint({
              exclude: ['/virtual:/**', 'node_modules/**'],
            }),
            vuetify({
              autoImport: true,
            }),
            ViteRequireContext(),
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
              { find: 'leaflet/dist/leaflet.css', replacement: 'leaflet/dist/leaflet.css' },
              { find: 'leaflet', replacement: 'leaflet/dist/leaflet.js' },
              { find: 'leaflet.markercluster/dist/MarkerCluster.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.css' },
              { find: 'leaflet.markercluster/dist/MarkerCluster.Default.css', replacement: 'leaflet.markercluster/dist/MarkerCluster.Default.css' },
              { find: 'leaflet.markercluster', replacement: 'leaflet.markercluster/dist/leaflet.markercluster.js' },
              // { find: 'vue', replacement: `vue/dist/vue.${ isProd ? 'min' : 'esm' }.js` },
              // { find: 'vue', replacement: '@vue/compat' },
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
