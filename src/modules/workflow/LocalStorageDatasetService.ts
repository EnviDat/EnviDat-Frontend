import { Dataset } from '@/modules/workflow/Dataset.ts';
import { DatasetService } from '@/types/modelTypes';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

import {
  readDatasetFromLocalStorage,
  storeDatasetInLocalStorage,
} from '@/factories/userCreationFactory';

export class LocalStorageDatasetService implements DatasetService {
  declare dataset: DatasetDTO;
  declare loadingDataset: boolean;

  declare datasetCount: number;

  constructor() {
    this.loadingDataset = true;
    this.datasetCount = 0;

    /*
    if (datasetBackend) {
      this.patchDatasetChanges(datasetBackend?.id, datasetBackend);
    } else {
      this.createDataset();
    }
*/
  }

  private getNewLocalDatasetId() {
    return `local_dataset_${this.user?.id || '' }_${++this.datasetCount}`;
  }

  private getLocalId() {
    return `local_dataset_${this.user?.id || '' }_${this.dataset?.id}`;
  }

  static isLocalId(datasetId: string) {
    return datasetId?.includes('local_dataset');
  }

  async loadDataset(id: string): Promise<DatasetDTO> {
    this.loadingDataset = true;

    const backendData = readDatasetFromLocalStorage(id);
    this.dataset = new Dataset(backendData);

    this.loadingDataset = false;
    return this.dataset;
  }
  // DOMINIK we need to define patch optional and then extract the id directly from the dataset, or directly pass as an argument the id (This is what I understood from the code)
  async patchDatasetChanges(
    datasetOrId: string | DatasetDTO,
    patch?: object,
  ): Promise<DatasetDTO> {
    this.loadingDataset = true;

    let datasetId: string;
    let data: object;

    if (typeof datasetOrId === 'object') {
      datasetId = datasetOrId.id;
      data = datasetOrId;
    } else {
      datasetId = datasetOrId;
      data = patch ?? {};
    }

    try {
      const existingData = readDatasetFromLocalStorage(
        datasetId || this.getLocalId(),
      );

      const storedData = storeDatasetInLocalStorage(
        datasetId || this.getLocalId(),
        {
          ...existingData,
          ...data,
        },
      );

      this.dataset = new Dataset(storedData);

      return this.dataset;
    } catch (e: unknown) {
      console.error(e);
      throw e;
    } finally {
      this.loadingDataset = false;
    }
  }

  async createResource(resourceData: ResourceDTO): Promise<ResourceDTO> {
    const currentResources = this.dataset.resources
      ? [...this.dataset.resources]
      : [];
    currentResources?.push(resourceData);

    await this.patchDatasetChanges(this.dataset.id, {
      resources: currentResources,
    });

    return resourceData;
  }

  private getDatasetWithDefaults(dataset: DatasetDTO): DatasetDTO {
    // const name = dataset.name ? dataset.name : getMetadataUrlFromTitle(dataset.title);

    const orgaId = dataset.organization?.id || '';

    return {
      'owner_org': orgaId,
      'resource_type_general': 'dataset',
      ...dataset,
      // name,
      private: true, // necessary otherwise the dataset would be public directly
    };
  }

  /*
  private getLocalDatasetWithDefaults(datasetId: string, user: User, prefilledOrganizationId) {

    const defaultDataset = {};
    initCreationDataWithDefaults(defaultDataset, user, prefilledOrganizationId);

    const stepKeys = Object.keys(defaultDataset);
    let flatDefaultDataset = {
      resources: [],
    };

    stepKeys.forEach((key) => {
      flatDefaultDataset = {
        ...defaultDataset[key],
        ...flatDefaultDataset,
      };
    });

    return new Dataset(undefined, {
      ...flatDefaultDataset,
      id: datasetId,
      resourceTypeGeneral: 'dataset', // default for all datasets
    });
  }
*/

  async createDataset(dataset: DatasetDTO): Promise<DatasetDTO> {
    const datasetId = this.getNewLocalDatasetId();
    localStorage.setItem(datasetId, '');

    const datasetWithDefaults = this.getDatasetWithDefaults(dataset);
    this.dataset = new Dataset(datasetWithDefaults);

    return this.patchDatasetChanges(this.dataset.id, this.dataset);
  }
}
