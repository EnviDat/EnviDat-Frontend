import { Dataset } from '@/modules/workflow/Dataset.ts';
import { DatasetService } from '@/types/modelTypes';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

import { LOCAL_DATASET_KEY } from '@/factories/metadataConsts';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

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

  // private getNewLocalDatasetId() {
  //   return `local_dataset__${++this.datasetCount}`;
  // }

  private getNewLocalDatasetId() {
    return LOCAL_DATASET_KEY;
  }

  private getLocalId() {
    return LOCAL_DATASET_KEY;
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

  async deleteResource(resourceId: string): Promise<boolean> {
    const newResources =
      this.dataset.resources?.filter((res) => res.id !== resourceId) || [];

    try {
      await this.patchDatasetChanges(this.dataset.id, {
        resources: newResources,
      });
    } catch (e) {
      return false;
    }

    return true;
  }

  // private getDatasetWithDefaults(dataset: DatasetDTO): DatasetDTO {
  //   // const name = dataset.name ? dataset.name : getMetadataUrlFromTitle(dataset.title);
  //   const organizationsStore = useOrganizationsStore();
  //   // Enhance default data
  //   const orgaId = organizationsStore.userOrganizations?.[0]?.id || '';
  //   const organization = organizationsStore.userOrganizations?.[0] || '';
  //   const name = dataset.name ? getMetadataUrlFromTitle(dataset.title) : '';

  //   // const orgaId = dataset.organization?.id || '';

  //   return {
  //     owner_org: orgaId,
  //     organization,
  //     name,
  //     resource_type_general: 'dataset',
  //     ...dataset,
  //     // name,
  //     private: true, // necessary otherwise the dataset would be public directly
  //   };
  // }

  // private getLocalDatasetWithDefaults(datasetId: string, user: User, prefilledOrganizationId) {

  //   const defaultDataset = {};
  //   initCreationDataWithDefaults(defaultDataset, user, prefilledOrganizationId);

  //   const stepKeys = Object.keys(defaultDataset);
  //   let flatDefaultDataset = {
  //     resources: [],
  //   };

  //   stepKeys.forEach((key) => {
  //     flatDefaultDataset = {
  //       ...defaultDataset[key],
  //       ...flatDefaultDataset,
  //     };
  //   });

  //   return new Dataset(undefined, {
  //     ...flatDefaultDataset,
  //     id: datasetId,
  //     resourceTypeGeneral: 'dataset', // default for all datasets
  //   });
  // }

  // TRY to implemente initCreationDataWithDefaults

  async createDataset(dataset: DatasetDTO): Promise<DatasetDTO> {
    const datasetWorkflowStore = useDatasetWorkflowStore();
    // IF already present, remove the existing local dataset
    if (localStorage.getItem(LOCAL_DATASET_KEY)) {
      localStorage.removeItem(LOCAL_DATASET_KEY);
    }

    const datasetId = this.getNewLocalDatasetId();
    // CREATE an empty entry in localStorage to mark the existence of this dataset
    console.log(datasetId);
    localStorage.setItem(datasetId, '');

    const datasetWithDefault = datasetWorkflowStore.applyDatasetDefaults({
      id: datasetId,
      ...dataset,
    });

    this.dataset = new Dataset(datasetWithDefault);
    // SET the datasetModel in the localStorage
    return this.patchDatasetChanges(datasetId, this.dataset);
  }
}
