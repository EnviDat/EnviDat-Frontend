import { Dataset } from '@/modules/workflow/viewModel/Dataset';
import { DatasetService } from '@/types/modelTypes';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel';
import {
  initCreationDataWithDefaults,
  readDatasetFromLocalStorage,
  storeDatasetInLocalStorage,
} from '@/factories/userCreationFactory';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

let mockDataResponse: DatasetDTO;
if (useTestdata) {
  mockDataResponse = await import('../../../../public/testdata/dataset_10-16904-1');
}


export class EditDatasetLocalStorageService implements DatasetService {

  declare dataset: DatasetDTO;
  declare loadingDataset: boolean;

  constructor(datasetBackend: unknown | undefined) {
    this.dataset = new Dataset(datasetBackend);
    this.loadingDataset = false;
  }

  async loadDataset(id: string) : Promise<DatasetDTO> {

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
    if (useTestdata) {
      return mockDataResponse.dataset.result;
    }

    try {
      storeDatasetInLocalStorage(datasetId, data);
      this.dataset = new Dataset(data);

      return this.dataset;
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }

  }


}
