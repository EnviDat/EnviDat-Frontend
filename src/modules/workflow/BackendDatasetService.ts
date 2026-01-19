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
import { ACTION_DOI_RESERVE, ACTION_DOI_REQUEST, ACTION_DOI_PUBLISH } from '@/modules/user/store/doiMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { Dataset } from '@/modules/workflow/Dataset.ts';
import { DatasetService, User } from '@/types/modelTypes';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import {
  ACTION_LOAD_METADATA_CONTENT_BY_ID,
  ACTION_IMPORT_METADATA_CONTENT_BY_ID,
} from '@/store/metadataMutationsConsts';
import { stringifyResourceForBackend } from '@/factories/mappingFactory';
import { convertJSON } from '@/factories/convertJSON';

import { cleanDatesForBackend, cleanPostData, normalizeTagsForPatch } from '@/modules/workflow/utils/formatPostData';

import { extractBodyIntoUrl } from '@/factories/stringFactory';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

let API_DOI_BASE = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

let mockDataResponse;
if (useTestdata) {
  mockDataResponse = await import('../../../public/testdata/dataset_10-16904-1');
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

  async importDataset(id: string, orgId?: string): Promise<DatasetDTO> {
    this.loadingDataset = true;
    const resolvedOrgId = orgId;
    const doi = id;
    const actionUrl = ACTION_IMPORT_METADATA_CONTENT_BY_ID();
    const url = urlRewrite(`${actionUrl}?doi=${doi}&owner_org=${resolvedOrgId}&add-placeholders=true`, '', API_ROOT);

    try {
      const response = await axios.get(url);
      this.dataset = new Dataset(response.data);
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

    const postData = this.createBackendPatchJson(data);
    postData.id = datasetId;

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
    const postData = stringifyResourceForBackend(resourceData);

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

  private createBackendPatchJson(dataset: Record<string, any>): Record<string, any> {
    let parseData = dataset;
    // GET the tags string and convert into object array
    if ('tags' in parseData) {
      parseData = normalizeTagsForPatch(dataset);
    }

    // GET the spatial and convert into geometry collection string
    if ('spatial' in parseData) {
      const wrapped = cleanPostData({ spatial: parseData.spatial }, { wrapSpatial: true });
      if (wrapped.spatial !== undefined) parseData.spatial = wrapped.spatial;
      else delete parseData.spatial;
    }

    return parseData;
  }

  // Local JSON converter with exclude support

  private createBackendJson(dataset: Record<string, any>, excluded: string[] = []): Record<string, any> {
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

  private async runDoiAction(actionFactory: () => string, metadataId: string, isImportDataset = false) {
    const actionUrl = actionFactory();
    const params: Record<string, unknown> = { 'package-id': metadataId };

    if (isImportDataset) {
      params['is-external-doi'] = true;
    }
    let url = extractBodyIntoUrl(actionUrl, params);
    url = urlRewrite(url, API_DOI_BASE, API_ROOT);

    try {
      await axios.get(url);

      // Reload dataset used in the UI
      const workflowStore = useDatasetWorkflowStore();
      await workflowStore.loadDataset(metadataId);

      // Refresh the service's cached dataset
      this.dataset = workflowStore.datasetModel?.dataset ?? this.dataset;

      return this.dataset;
    } catch (e) {
      // Bubble up so caller can surface error
      return Promise.reject(e);
    }
  }

  async requestDoi(metadataId: string) {
    return this.runDoiAction(ACTION_DOI_RESERVE, metadataId);
  }

  async requestPublication(metadataId: string) {
    return this.runDoiAction(ACTION_DOI_REQUEST, metadataId);
  }

  async publishDataset(metadataId: string, isImportDataset: boolean) {
    return this.runDoiAction(ACTION_DOI_PUBLISH, metadataId, isImportDataset);
  }

  async createDataset(dataset?: DatasetDTO, user?: User): Promise<DatasetDTO> {
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
    const datasetWithDefault = datasetWorkflowStore.applyDatasetDefaults(dataset ?? ({} as DatasetDTO), '');

    // IMPORT logic, add to the package_create the value is_import true
    const isImport = Boolean((dataset as any)?.is_import ?? (dataset as any)?.isImportDataset);
    if (isImport) {
      const extras = Array.isArray(datasetWithDefault.extras) ? datasetWithDefault.extras : [];
      extras.push({ key: 'is_import', value: 'true' });
      datasetWithDefault.extras = extras;
    }

    const actionUrl = ACTION_METADATA_CREATION_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = this.createBackendJson(datasetWithDefault, ['tags', 'resources', 'organization', 'extras']);

    this.loadingDataset = true;
    try {
      const response = await axios.post(url, postData);
      console.log(response);
      return new Dataset(response.data.result);
    } catch (e: any) {
      const data = e?.response?.data;
      const status = e?.response?.status;

      const nameErr = data?.error?.name?.[0];
      const message = data?.error?.message || nameErr || e?.message || 'Unknown error';

      const err = new Error(message) as any;
      err.status = status;

      err.response = e?.response;
      throw err;
    } finally {
      this.loadingDataset = false;
    }
  }
}
