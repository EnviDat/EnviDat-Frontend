import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue2';

import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import cesium from 'vite-plugin-cesium';
import eslint from 'vite-plugin-eslint';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import { VitePluginFonts } from 'vite-plugin-fonts';

import { getFilesWithPrefix } from './src/factories/enhancementsFactoryNode';

const version = process.env.npm_package_version;


export default ({ mode }) => {
    const isProd = mode === 'production'
    const cesiumSource = 'node_modules/@cesium/engine/Source'
    // const cesiumSource = 'node_modules/cesium/Source'

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
            eslint(),
            cesium(),
            ViteRequireContext(),
            Components({
                resolvers: [
                  // Vuetify
                  VuetifyResolver(),
                ],
            }),
            VitePluginFonts({
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
            viteStaticCopy({
                targets: [
                  {
                    src: path.join(cesiumSource, '../Build/Cesium/Workers'),
                    dest: 'Workers',
                  },
                  {
                    src: path.join(cesiumSource, 'Assets'),
                    dest: 'Assets',
                    globOptions: {
                      ignore: ['Images/**', 'Textures/**', 'IAU2006_XYS/**'],
                    },
                  },
                  {
                    src: 'node_modules/amcharts3/amcharts/images',
                    dest: 'amcharts/images',
                  },
                ],
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
              { find: 'cesium', replacement: path.resolve(__dirname, cesiumSource) },
              { find: 'vue', replacement: 'vue/dist/vue.esm.js' },
            ],
        },
        build: {
            assetsDir: './static',
            chunkSizeWarningLimit: 600,
            cssCodeSplit: true,
            // sourcemap: true,
            emptyOutDir: true,
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
