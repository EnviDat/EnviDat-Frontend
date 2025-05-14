
// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import { ACTION_METADATA_EDITING_PATCH_DATASET } from '@/modules/user/store/userMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { Dataset } from '@/factories/ViewModels/Dataset.ts';
import { DatasetDTO, DatasetServiceLayer } from '@/types/modelTypes';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { ACTION_LOAD_METADATA_CONTENT_BY_ID } from '@/store/metadataMutationsConsts';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

let mockDataResponse;
if (useTestdata) {
  mockDataResponse = await import('../../../public/testdata/dataset_10-16904-1');
}


if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT || '';
}

export class EditDatasetServiceLayer implements DatasetServiceLayer {

  declare dataset: DatasetDTO;
  declare loadingDataset: boolean;

  constructor(datasetBackend: unknown | undefined) {
    this.dataset = new Dataset(datasetBackend);
    this.loadingDataset = false;
  }

  async loadDataset(id: string) {

    this.loadingDataset = true;
    const actionUrl = ACTION_LOAD_METADATA_CONTENT_BY_ID();
    const url = urlRewrite(`${actionUrl}?id=${id}`, API_BASE, API_ROOT);

    try {
      const response = await axios.get(url);
      this.dataset = new Dataset(response.data);
    } catch (e: Error) {
      console.error(e);
      throw e;
    }

    this.loadingDataset = false;
    return this.dataset;
  }

  async patchDatasetChanges(
    datasetId: string,
    viewModel: AbstractEditViewModel,
  ) {
    if (useTestdata) {
      return mockDataResponse.dataset.result;
    }

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = viewModel.backendJSON;
    postData.id = datasetId;

    try {
      const response = await axios.post(url, postData, {
        headers: {
          // Authorization: apiKey,
        },
      });

      this.dataset = new Dataset(response.data);

      return this.dataset;
    } catch (e: Error) {
      console.error(e);
      throw e;
    }

  }


}
