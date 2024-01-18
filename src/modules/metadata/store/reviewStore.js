import { defineStore } from 'pinia';
import axios from 'axios';

import {
  ACTION_METADATA_REVIEW,
  ACTION_METADATA_REVIEW_RESOURCES,
  METADATA_REVIEW_STORE,
} from '@/store/metadataMutationsConsts';

import { urlRewrite } from '@/factories/apiFactory';

let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL;
  API_ROOT = import.meta.env.VITE_API_ROOT;
}

const initState = {
  loadingMetadata: false,
  metadata: {},
  metadataError: null,
  loadingResources: false,
  resources: [],
  resourcesError: null,
}

export const useReviewStore = defineStore(METADATA_REVIEW_STORE, {
  state: () => ({ ...initState }),
/*
  getters: {
    doubleCount: (state) => state.count * 2,
  },
*/
  actions: {
    async loadReviewMetadata(metadataId) {

      this.loadingMetadata = true;
      const actionUrl = ACTION_METADATA_REVIEW();
      const url = urlRewrite(`${actionUrl}?id=${metadataId}`, API_BASE, API_ROOT);

      try {
        const response = await axios.get(url);

        this.metadata = response.data.result;
      } catch (e) {
        this.metadataError = e;
      } finally {
        this.loadingMetadata = false;
      }
    },
    async loadReviewResources(metadataId) {

      this.loadingResources = true;
      const actionUrl = ACTION_METADATA_REVIEW_RESOURCES();
      const url = urlRewrite(`${actionUrl}?id=${metadataId}`, API_BASE, API_ROOT);

      try {
        const response= await axios.get(url);

        this.resources = response.data.result;
      } catch (e) {
        this.resourcesError = e;
      } finally {
        this.loadingResources = false;
      }
    },
  },
})
