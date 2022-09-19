import fs from 'fs'
import path from 'path'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import cesium from 'vite-plugin-cesium'
import eslint from 'vite-plugin-eslint'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { createVuePlugin } from 'vite-plugin-vue2'

import { version } from './package.json'
// TODO exposing package.json to app is potential security risk
import { getFilesWithPrefix } from './src/factories/enhancementsFactoryNode.js'


export default ({ mode }) => {
    const isProd = mode === 'production'
    const cesiumSource = 'node_modules/cesium/Source'

    if (isProd) {
        const fileName = `version_${version}.txt`;
        const existingFilePaths = path.resolve(__dirname, 'public/')

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
            eslint(),
            cesium(),
            createVuePlugin(),
            Components({
                resolvers: [
                  // Vuetify
                  VuetifyResolver(),
                ],
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
        },
        optimizeDeps: {
            include: ['vuetify', 'vuex-persist'],
        },
        base: './',
        // runtimeCompiler: true,
        resolve: {
            alias: {
                // 'vue': path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js'),
                '@': path.resolve(__dirname, 'src'),
                '~': path.resolve(__dirname),
                'cesium': path.resolve(__dirname, cesiumSource),
            },
        },
        build: {
            assetsDir: './static',
            chunkSizeWarningLimit: 600,
            cssCodeSplit: false,
            // sourcemap: true,
            emptyOutDir: true,
/*
            rollupOptions: {
                output: {
                  entryFileNames: 'static/[name][hash].js',
                  chunkFileNames: 'static/[name][hash].js',
                  assetFileNames: 'static/[name].[ext]',
                },
            },
*/
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
