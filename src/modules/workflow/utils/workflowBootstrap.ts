// src/modules/workflow/utils/bootstrapWorkflow.ts

import { WorkflowMode } from '@/modules/workflow/utils/workflowEnums';

export interface BootstrapDeps<DatasetDTO> {
  loadBackend: (id: string) => Promise<DatasetDTO | null>;
  loadLocal: (id: string) => Promise<DatasetDTO | null>;
  createLocal: (init: Partial<DatasetDTO>) => Promise<DatasetDTO>;
}

// CHECK if the dataset is present in localStorage
// TODO: this logic needs to be properly implemented
function existsInLocalStorage(id?: string): boolean {
  if (!id) return false;
  try {
    return !!window.localStorage.getItem(id);
  } catch {
    return false;
  }
}

// TODO ENRICO use the correct pros here
function isPublished(dto: any): boolean {
  return Boolean(
    dto?.published === true ||
      dto?.publishedAt ||
      dto?.status === 'published' ||
      dto?.doi,
  );
}

// MAIN LOGIC – We define the environment to be used.
// This function is the page initializer and is called on mounted by bootstrapWorkflow.

export async function resolveBootstrap<DatasetDTO>(
  datasetId: string | undefined,
  deps: BootstrapDeps<DatasetDTO>,
): Promise<{ dto: DatasetDTO; mode: WorkflowMode }> {
  // CHECK if the dataset is present in the backend
  if (datasetId) {
    try {
      const dto = await deps.loadBackend(datasetId);
      if (dto)
        return {
          dto,
          mode: isPublished(dto) ? WorkflowMode.Edit : WorkflowMode.Create,
        };
    } catch (e) {
      console.log(e);
    }
  }

  // CHECK if the dataset is present in the localstorage
  if (datasetId && existsInLocalStorage(datasetId)) {
    try {
      const dto = await deps.loadLocal(datasetId);
      console.log(dto);
      if (dto) return { dto, mode: WorkflowMode.Create };
    } catch (e) {
      console.log(e);
    }
  }
  // CHECK if the nothing, it means NEW dataset - SET the mode to create
  const dto = await deps.createLocal({} as Partial<DatasetDTO>);
  return { dto, mode: WorkflowMode.Create };
}
