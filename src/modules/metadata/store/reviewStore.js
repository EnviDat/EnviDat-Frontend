import { defineStore } from 'pinia';
import axios from 'axios';

import {
  ACTION_METADATA_REVIEW,
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
  metadataNotFound: null,
}

export const useReviewStore = defineStore(METADATA_REVIEW_STORE, {
  state: () => ({ ...initState }),
  actions: {
    async loadReviewMetadata(datasetId) {

      this.loadingMetadata = true;
      const actionUrl = ACTION_METADATA_REVIEW();
      const url = urlRewrite(`${actionUrl}/${datasetId}`, API_BASE, API_ROOT);

      try {
        const response = await axios.get(url);

        this.metadata = response.data.result;
      } catch (e) {
        if (e.response && e.response.status === 404) {
          this.metadataNotFound = 'Dataset not found (404)';
        } else {
          this.metadataError = e;
        }
      } finally {
        this.loadingMetadata = false;
      }
    },
    resetReview() {
      this.state = initState;
    },
  },
})
