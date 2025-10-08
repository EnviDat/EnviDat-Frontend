// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import {
  ACTION_METADATA_CREATION_DATASET,
  ACTION_METADATA_CREATION_RESOURCE,
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

type ConvertJsonOptions = {
  exclude?: Array<string | RegExp>;
  predicate?: (args: {
    key: string;
    path: string;
    value: unknown;
    stringify: boolean;
  }) => boolean;
};
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

  // Local JSON converter with exclude support
  private getBackendJson(
    data: Record<string, any>,
    stringify: boolean,
    options?: ConvertJsonOptions,
    recursive = false,
  ): Record<string, any> {
    const jsonStartRegex = /^\s*[[{]/;
    const ex = options?.exclude ?? [];
    const asStringSet = new Set(
      ex.filter((x): x is string => typeof x === 'string'),
    );
    const regexes = ex.filter((x): x is RegExp => x instanceof RegExp);

    const shouldSkip = (key: string, path: string, value: unknown): boolean => {
      if (asStringSet.has(key) || asStringSet.has(path)) return true;
      if (regexes.some((r) => r.test(key) || r.test(path))) return true;
      if (options?.predicate?.({ key, path, value, stringify })) return true;
      return false;
    };

    const process = (obj: any, pathParts: string[] = []): any => {
      if (Array.isArray(obj)) {
        if (!recursive) return obj;
        return obj.map((item, i) => process(item, pathParts.concat(String(i))));
      }

      if (obj === null || typeof obj !== 'object') return obj;

      const out: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        const path = [...pathParts, key].join('.');
        const skip = shouldSkip(key, path, obj[key]);
        let v = obj[key];

        if (stringify) {
          if (skip) {
            out[key] = v;
          } else if (Array.isArray(v)) {
            out[key] = JSON.stringify(v);
          } else if (v && typeof v === 'object') {
            out[key] = recursive
              ? process(v, pathParts.concat(key))
              : JSON.stringify(v);
          } else {
            out[key] = v;
          }
        } else {
          if (!skip && typeof v === 'string' && jsonStartRegex.test(v)) {
            try {
              v = JSON.parse(v);
            } catch (e) {
              console.error(e);
            }
          }

          if (!skip && recursive) {
            if (Array.isArray(v)) {
              v = v.map((item, i) =>
                process(item, pathParts.concat(key, String(i))),
              );
            } else if (v && typeof v === 'object') {
              v = process(v, pathParts.concat(key));
            }
          }

          out[key] = v;
        }
      }
      return out;
    };

    return process(data);
  }

  async createDataset(dataset: DatasetDTO): Promise<ResourceDTO> {
    const datasetWorkflowStore = useDatasetWorkflowStore();
    const datasetWithDefault = datasetWorkflowStore.applyDatasetDefaults(
      dataset,
      '',
    );

    const actionUrl = ACTION_METADATA_CREATION_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = this.getBackendJson(
      datasetWithDefault,
      true,
      { exclude: ['tags', 'resources', 'extras', 'organization'] },
      false,
    );

    this.loadingDataset = true;
    try {
      const response = await axios.post(url, postData);
      return response.data.result;
    } finally {
      this.loadingDataset = false;
    }
  }
}
