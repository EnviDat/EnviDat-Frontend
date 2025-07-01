
// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import {
  ACTION_METADATA_CREATION_RESOURCE,
  ACTION_METADATA_EDITING_PATCH_DATASET,
} from '@/modules/user/store/userMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { Dataset } from '@/modules/workflow/Dataset.ts';
import { DatasetService } from '@/types/modelTypes';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { ACTION_LOAD_METADATA_CONTENT_BY_ID } from '@/store/metadataMutationsConsts';
import { getBackendJSONForStep, stringifyResourceForBackend } from '@/factories/mappingFactory';
import { EDITMETADATA_DATA_RESOURCE } from '@/factories/eventBus';

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

export class BackendDatasetService implements DatasetService {

  declare dataset: DatasetDTO;
  declare loadingDataset: boolean;

  constructor(datasetBackend: unknown | undefined) {
    this.dataset = new Dataset(datasetBackend);
    this.loadingDataset = false;
  }

  async loadDataset(id: string) : Promise<DatasetDTO> {

    this.loadingDataset = true;
    const actionUrl = ACTION_LOAD_METADATA_CONTENT_BY_ID();
    const url = urlRewrite(`${actionUrl}?id=${id}`, API_BASE, API_ROOT);

    try {
      const response = await axios.get(url);
      this.dataset = new Dataset(response.data.result);
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }

    this.loadingDataset = false;
    return this.dataset;
  }

  async patchDatasetChanges(
    datasetId: string,
    data: object,
  ) {
    if (useTestdata) {
      return mockDataResponse.dataset.result;
    }

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = {
      ...data,
      id: datasetId,
    };

    try {
      const response = await axios.post(url, postData, {
        headers: {
          // Authorization: apiKey,
        },
      });

      this.dataset = new Dataset(response.data.result);

      return this.dataset;
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }

  }

  async createResource(resoureData: ResourceDTO): Promise<ResourceDTO> {

    const actionUrl = ACTION_METADATA_CREATION_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const cleaned = getBackendJSONForStep(EDITMETADATA_DATA_RESOURCE, resoureData);
    const postData = stringifyResourceForBackend(cleaned);

    try {
      const response = await axios.post(url, postData);

      const resource = response.data.result;

      return resource;
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }

  }

}
