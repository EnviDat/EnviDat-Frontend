import { defineStore } from 'pinia';
import { EDIT_DATASET_STORE } from '@/store/metadataMutationsConsts';
import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer.js';


const editServiceLayer = new EditDatasetServiceLayer();

const initState = {

}

export const useEditStore = defineStore(EDIT_DATASET_STORE, {
  state: () => ({ ...initState }),
  actions: {
    async loadDataset(datasetId) {

      try {
        return await editServiceLayer.loadViewModels(datasetId);
      } catch (e: Error) {
        console.error(e);
      } finally {
        this.loadingMetadata = false;
      }
    },
  },
})
