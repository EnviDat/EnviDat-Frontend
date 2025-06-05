import { convertJSON } from '@/factories/mappingFactory';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';

// @ts-ignore TS2420
export class Dataset implements DatasetDTO {
  
  constructor(datasetBackend: unknown | undefined) {
    if (!datasetBackend) {
      return;
    }

    this.convertBackendDataset(datasetBackend);
  }

  convertBackendDataset(datasetBackend: unknown) {
    const frontendJson = convertJSON(datasetBackend, false);
    Object.assign(this, frontendJson);
  }

}
