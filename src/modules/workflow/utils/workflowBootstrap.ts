// src/modules/workflow/utils/bootstrapWorkflow.ts

import { WorkflowMode } from '@/modules/workflow/utils/workflowEnums';
import { LOCAL_DATASET_KEY } from '@/factories/metadataConsts';

/* eslint-disable no-unused-vars */
export interface BootstrapDeps<DatasetDTO> {
  loadBackend: (id: string) => Promise<DatasetDTO | null>;
  loadLocal: (id: string) => Promise<DatasetDTO | null>;
  createLocal: (init: Partial<DatasetDTO>) => Promise<DatasetDTO>;
  createBackend: (init: Partial<DatasetDTO>) => Promise<DatasetDTO>;
}
/* eslint-enable no-unused-vars */

// CHECK if the dataset is present in localStorage
function existsInLocalStorage(id?: string): boolean {
  if (!id) return false;
  try {
    return !!window.localStorage.getItem(id);
  } catch {
    return false;
  }
}

// TODO ENRICO use the correct props here
function isPublished(dto: any): boolean {
  return Boolean(dto?.publication_state === 'published');
}

// MAIN LOGIC – We define the environment to be used.
// This function is the page initializer and is called on mounted by bootstrapWorkflow.
export async function resolveBootstrap<DatasetDTO>(
  datasetId: string | undefined,
  deps: BootstrapDeps<DatasetDTO>,
): Promise<{ dto: DatasetDTO; mode: WorkflowMode }> {
  if (datasetId) {
    try {
      const backendDto = await deps.loadBackend(datasetId);
      if (backendDto) {
        if (isPublished(backendDto)) {
          // Case 2: published → edit directly from backend
          return { dto: backendDto, mode: WorkflowMode.Edit };
        }
        // Case 3: NOT published → seed local with backend data, then use Create mode
        const seededLocal = await deps.createLocal(
          backendDto as Partial<DatasetDTO>,
        );
        return { dto: seededLocal, mode: WorkflowMode.Create };
      }
    } catch (e) {
      console.log(e);
    }
  }
  // IF LOCAL_DATASET_KEY is present in localStorage
  if (existsInLocalStorage(LOCAL_DATASET_KEY)) {
    try {
      const dto = await deps.loadLocal(LOCAL_DATASET_KEY);
      if (dto) return { dto, mode: WorkflowMode.Create };
    } catch (e) {
      console.log(e);
    }
  }

  // CREATE a new local dataset
  const dto = await deps.createLocal({} as Partial<DatasetDTO>);
  return { dto, mode: WorkflowMode.Create };
}
