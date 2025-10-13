import type { DatasetDTO } from '../src/types/dataTransferObjectsTypes';
import { loadDataset } from '../pages/datasets';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  hooks: {
    async 'prerender:routes' (ctx) {
      const datasets: DatasetDTO[] = await loadDataset();

      for (const dataset of datasets) {
        ctx.routes.add(`/metadata/${dataset.name}`)
      }
    },
  },  
  // prerender: {
  //   routes: ['/user/1', '/user/2'],
  //   ignore: ['/dynamic'],
  // },  
})