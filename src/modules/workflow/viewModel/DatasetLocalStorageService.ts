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

    this.datasetCount = 0;

    if (datasetBackend) {
      this.patchDatasetChanges(datasetBackend?.id, datasetBackend)
    } else {
      // this.dataset = new Dataset(datasetBackend);
      this.loadingDataset = false;
    }
  }

  private getLocalId() {
    return this.dataset?.id ? this.dataset.id : `local_dataset_${this.datasetCount}`
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

    await this.patchDatasetChanges(this.getLocalId(), {
      resources: currentResources,
    })

    return resoureData;
  }

}
