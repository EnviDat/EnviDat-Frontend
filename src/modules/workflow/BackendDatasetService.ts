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
import { ACTION_DOI_RESERVE } from '@/modules/user/store/doiMutationsConsts';
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

import {
  cleanDatesForBackend,
  cleanPostData,
} from '@/modules/workflow/utils/formatPostData';

import { extractBodyIntoUrl } from '@/factories/stringFactory';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

let API_DOI_BASE = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

let mockDataResponse;
if (useTestdata) {
  mockDataResponse = await import(
    '../../../public/testdata/dataset_10-16904-1'
  );
} else {
  API_DOI_BASE = import.meta.env.VITE_API_DOI_BASE_URL || '/doi-api/datacite/';
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

  async deleteResource(resourceId: string): Promise<boolean> {
    const postData = {
      id: resourceId,
    };

    const actionUrl = ACTION_METADATA_DELETE_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    try {
      await axios.post(url, postData, {
        headers: {
          // Authorization: apiKey,
        },
      });

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

    const local: Record<string, any> = { ...dataset };
    if (local.date != null) {
      const cleanedDates = cleanDatesForBackend(local.date);
      if (cleanedDates.length > 0) {
        local.date = cleanedDates;
      }
    }

    // Convert everything )
    const obj = convertJSON(local, true);

    // Restore excluded keys as original
    for (const key of excluded) {
      if (key in saved) obj[key] = saved[key];
    }

    return cleanPostData(obj, {
      keepEmptyKeys: ['doi', 'publication_state'],
      wrapSpatial: true,
      dropEmptyJsonBraces: true,
    });
  }

  async requestDoi(id) {
    const actionUrl = ACTION_DOI_RESERVE();
    let url = extractBodyIntoUrl(actionUrl, { 'package-id': id });
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      const response = await axios.get(url);
      const result = response.data.result;
      const reservedDOI = result?.data?.id;
      return console.log(reservedDOI);

      // reload the metadata entry to get the changes to the publicationState
      // TODO Implemente refresh if we need it
      // await reloadMetadataForEditing(dispatch, metadataId);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createDataset(dataset?: DatasetDTO): Promise<DatasetDTO> {
    const datasetWorkflowStore = useDatasetWorkflowStore();
    // GET default value for the dataset
    // id
    // owner_org
    // organization
    // name
    // private
    // resource_type_general
    // publication,
    // maintainer TODO DOMINIK check if we need it
    const datasetWithDefault = datasetWorkflowStore.applyDatasetDefaults(
      dataset ?? ({} as DatasetDTO),
      '',
    );

    const actionUrl = ACTION_METADATA_CREATION_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = this.getBackendJson(datasetWithDefault, [
      'tags',
      'resources',
      'organization',
      'extras',
    ]);

    this.loadingDataset = true;
    try {
      const response = await axios.post(url, postData);
      return new Dataset(response.data.result);
    } catch (e: any) {
      const message =
        e?.response?.data?.error?.message ?? e?.message ?? 'Unknown error';
      const err = new Error(message) as any;
      err.status = e?.response?.status;
      throw err;
    } finally {
      this.loadingDataset = false;
    }
  }
}
