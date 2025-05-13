import { convertJSON } from '@/factories/mappingFactory';
import type { DatasetDTO } from '@/types/modelTypes';

// @ts-ignore TS2420
export class Dataset implements DatasetDTO {
  
  constructor(datasetBackend: unknown) {
    this.convertBackendDataset(datasetBackend);
  }

  convertBackendDataset(datasetBackend: unknown) {
    const frontendJson = convertJSON(datasetBackend, false);
    Object.assign(this, frontendJson);
  }

}
