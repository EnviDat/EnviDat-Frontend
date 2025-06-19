import { convertJSON } from '@/factories/mappingFactory';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';

export class Dataset {
  
  constructor(datasetBackend: DatasetDTO, frontendDataset?: unknown) {
    if (datasetBackend) {
      this.convertBackendDataset(datasetBackend);
    } else if (frontendDataset) {
      Object.assign(this, frontendDataset);
    }
  }

  convertBackendDataset(datasetBackend: unknown) {
    const frontendJson = convertJSON(datasetBackend, false);
    Object.assign(this, frontendJson);
  }

}
