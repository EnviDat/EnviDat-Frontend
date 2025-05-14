import { defineStore } from 'pinia';
import { EDIT_DATASET_STORE } from '@/store/metadataMutationsConsts';
import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer.js';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';


const datasetViewModel = new DatasetViewModel(new EditDatasetServiceLayer(undefined))

const initState = {
  datasetViewModel,
}

export const useEditStore = defineStore(EDIT_DATASET_STORE, {
  state: () => ({ ...initState }),
  actions: {

    async loadDatasetViewModels(datasetId: string) {

      try {
        await datasetViewModel.loadViewModels(datasetId);
      } catch (e) {
        console.error(e);
      }
    },
  },
})
