// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import {
  ACTION_METADATA_CREATION_DATASET,
  ACTION_METADATA_CREATION_RESOURCE,
  ACTION_METADATA_DELETE_RESOURCE,
  ACTION_METADATA_EDITING_PATCH_DATASET,
} from '@/modules/user/store/userMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { Dataset } from '@/modules/workflow/Dataset.ts';
import { DatasetService } from '@/types/modelTypes';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { ACTION_LOAD_METADATA_CONTENT_BY_ID } from '@/store/metadataMutationsConsts';
import {
  getBackendJSONForStep,
  stringifyResourceForBackend,
  convertJSON,
} from '@/factories/mappingFactory';
import { EDITMETADATA_DATA_RESOURCE } from '@/factories/eventBus';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

let mockDataResponse;
if (useTestdata) {
  mockDataResponse = await import(
    '../../../public/testdata/dataset_10-16904-1'
  );
} else {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT || '';
}

export class BackendDatasetService implements DatasetService {
  declare dataset: DatasetDTO;
  declare loadingDataset: boolean;

  constructor() {
    this.dataset = undefined;
    this.loadingDataset = false;
  }

  async loadDataset(id: string): Promise<DatasetDTO> {
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

  async patchDatasetChanges(datasetId: string, data: object) {
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

  async createResource(resourceData: ResourceDTO): Promise<ResourceDTO> {
    const actionUrl = ACTION_METADATA_CREATION_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const cleaned = getBackendJSONForStep(
      EDITMETADATA_DATA_RESOURCE,
      resourceData,
    );
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

  async deleteResource(resourceId: string) : Promise<boolean> {
    const postData = {
      id: resourceId,
    };

    const actionUrl = ACTION_METADATA_DELETE_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    try {
      await axios.post(url, postData,
        {
          headers: {
            // Authorization: apiKey,
          },
        })

      return true;
    } catch (err: Error) {
      console.error(err);
    }

    return false;
  }

  // Local JSON converter with exclude support

  private getBackendJson(
    dataset: Record<string, any>,
    excluded: string[] = [],
  ): Record<string, any> {
    // Save originals
    const saved: Record<string, any> = {};
    for (const key of excluded) {
      if (key in dataset) saved[key] = dataset[key];
    }

    // Convert everything )
    const obj = convertJSON(dataset, true);

    // Restore excluded keys as original
    for (const key of excluded) {
      if (key in saved) obj[key] = saved[key];
    }

    // remove null or indefined properties
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v === null || v === undefined || v === 'null') {
        delete obj[k];
      }
    }

    return obj;
  }

  async createDataset(dataset: DatasetDTO): Promise<ResourceDTO> {
    const datasetWorkflowStore = useDatasetWorkflowStore();
    const datasetWithDefault = datasetWorkflowStore.applyDatasetDefaults(
      dataset,
      '',
    );

    const actionUrl = ACTION_METADATA_CREATION_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);
    const postData = this.getBackendJson(datasetWithDefault, [
      'tags',
      'resources',
      'extras',
      'organization',
    ]);

    this.loadingDataset = true;
    try {
      const response = await axios.post(url, postData);
      return response.data.result;
    } finally {
      this.loadingDataset = false;
    }
  }
}
