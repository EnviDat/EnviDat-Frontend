import { Dataset } from '@/modules/workflow/viewModel/Dataset';
import { DatasetService } from '@/types/modelTypes';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

import {
  initCreationDataWithDefaults,
  readDatasetFromLocalStorage,
  storeDatasetInLocalStorage,
} from '@/factories/userCreationFactory';



export class DatasetLocalStorageService implements DatasetService {

  declare dataset: DatasetDTO;
  declare loadingDataset: boolean;

  declare datasetCount: number;

  constructor(datasetBackend?: DatasetDTO | undefined) {

    this.loadingDataset = true;
    this.datasetCount = 0;

    if (datasetBackend) {
      this.patchDatasetChanges(datasetBackend?.id, datasetBackend);
    } else {

      const defaultDataset = {};
      initCreationDataWithDefaults(defaultDataset);

      const stepKeys = Object.keys(defaultDataset);
      let flatDefaultDataset = {
        resources: [],
      };

      stepKeys.forEach((key) => {
        flatDefaultDataset = {
          ...defaultDataset[key],
          ...flatDefaultDataset,
        }
      })

      this.dataset = new Dataset(
        undefined,
        {
          ...flatDefaultDataset,
          id: this.getLocalId(),
        },
      );
    }

    this.loadingDataset = false;
  }

  private getLocalId() {
    return `local_dataset_${this.dataset?.id ? this.dataset.id : this.datasetCount}`;
  }

  async loadDataset(id: string): Promise<DatasetDTO> {

    this.loadingDataset = true;

    const backendData = readDatasetFromLocalStorage(id);
    this.dataset = new Dataset(backendData);

    this.loadingDataset = false;
    return this.dataset;
  }

  async patchDatasetChanges(
    datasetId: string,
    data: object,
  ) {

    this.loadingDataset = false;

    try {
      const existingData = readDatasetFromLocalStorage(datasetId || this.getLocalId());

      const storedData = storeDatasetInLocalStorage(datasetId || this.getLocalId(), {
        ...existingData,
        ...data,
      });

      this.dataset = new Dataset(storedData);

      this.loadingDataset = true;

      return this.dataset;
    } catch (e: unknown) {
      this.loadingDataset = false;
      console.error(e);
      throw e;
    }


  }

  async createResource(resoureData: ResourceDTO): Promise<ResourceDTO> {
    const currentResources = [...this.dataset.resources];
    currentResources.push(resoureData);

    await this.patchDatasetChanges(this.dataset.id, {
      resources: currentResources,
    })

    return resoureData;
  }

}
