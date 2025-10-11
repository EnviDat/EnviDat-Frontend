import type { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

import { AdminViewModel } from '@/modules/workflow/viewModel/AdminViewModel.ts';
import { AuthorListViewModel } from '@/modules/workflow/viewModel/AuthorListViewModel.ts';
import { EditDataInfoViewModel } from '@/modules/workflow/viewModel/EditDataInfoViewModel.ts';
import { PublicationViewModel } from '@/modules/workflow/viewModel/PublicationViewModel.ts';
import { ResourcesListViewModel } from '@/modules/workflow/viewModel/ResourcesListViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { MetadataBaseViewModel } from '@/modules/workflow/viewModel/MetadataBaseViewModel.ts';
import { AdditionalInfoViewModel } from '@/modules/workflow/viewModel/AdditionalInfoViewModel.ts';
import { GeoInfoViewModel } from '@/modules/workflow/viewModel/GeoInfoViewModel.ts';
import { RelatedResearchViewModel } from '@/modules/workflow/viewModel/RelatedResearchViewModel.ts';
import { PublicationInfoViewModel } from '@/modules/workflow/viewModel/PublicationInfoViewModel.ts';
import { LOCAL_DATASET_KEY } from '@/factories/metadataConsts';

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';

import store from '@/store/store';
import { reactive, computed } from 'vue';

export class DatasetModel {
  viewModelClasses = [
    AuthorListViewModel,
    AdminViewModel,
    EditDataInfoViewModel,
    PublicationViewModel,
    ResourcesListViewModel,
    MetadataBaseViewModel,
    AdditionalInfoViewModel,
    GeoInfoViewModel,
    RelatedResearchViewModel,
    PublicationInfoViewModel,
  ];

  private viewModelInstances: Map<string, any> = new Map();

  declare datasetWorkflow: any;

  declare resourceCounter: number;

  constructor(datasetWorkflow: any) {
    this.datasetWorkflow = datasetWorkflow;
    this.resourceCounter = 0;

    this.createViewModels();

    if (this.datasetWorkflow?.getDatasetService()) {
      this.updateViewModels();
    }
  }

  private clearViewModels(): void {
    this.viewModelInstances = new Map<string, any>();
  }

  private createViewModels() {
    this.clearViewModels();

    for (const VMClass of this.viewModelClasses) {
      // @ts-ignore
      const instance = new VMClass(this);

      if (instance instanceof MetadataBaseViewModel) {
        instance.existingKeywords = computed(
          () => store.getters['metadata/existingKeywords'] ?? [],
        );
      }
      // TODO ENRICO handle here authors as well

      const reactiveVM = reactive(instance);
      this.viewModelInstances.set(instance.constructor.name, reactiveVM);
    }
  }

  async loadDataset(datasetId: string): Promise<DatasetDTO> {
    const datasetService = this.datasetWorkflow.getDatasetService();
    await datasetService.loadDataset(datasetId);
    this.updateViewModels();
    return datasetService.dataset;
  }

  async createResourceOnExistingDataset(
    resourceModel: AbstractEditViewModel,
  ): Promise<ResourceDTO | undefined> {
    let newResource;
    resourceModel.loading = true;
    resourceModel.error = undefined;

    try {
      const datasetService = this.datasetWorkflow.getDatasetService();
      newResource = await datasetService.createResource(
        resourceModel.backendJSON,
      );

      // reload dataset to update all viewModels
      await this.loadDataset(this.dataset.id);

      // update specifically the ResourcesListViewModel with the newly created Resource
      // this.getViewModel('ResourcesListModel').updateModel(this.dataset);

      resourceModel.savedSuccessful = true;
    } catch (reason) {
      resourceModel.savedSuccessful = false;
      resourceModel.error = reason;
    }

    resourceModel.loading = false;
    return newResource;
  }

  async deleteResourceOnExistingDataset(resourceId: string): Promise<boolean> {
    return this.datasetWorkflow.getDatasetService().deleteResource(resourceId);
  }

  async patchViewModel(newModel: AbstractEditViewModel) {
    const id: string =
      this.datasetWorkflow.currentDatasetId?.trim() || LOCAL_DATASET_KEY;

    const datasetService = this.datasetWorkflow.getDatasetService();
    await datasetService.patchDatasetChanges(id, newModel.backendJSON);

    this.updateViewModels();

    // send the clearing to the UI components to clear their internal state
    // this still needs to be resolved in a better way, but for now it's done vie the eventBus
    // because there is no direct connection to the UI components here (and should not be)
    // eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

    // TODO: here is only for local testing, should only happen in the success case
    eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

    newModel.loading = false;
  }

  get viewModels() {
    return this.viewModelInstances;
  }

  getViewModel(modelName: string) {
    return this.viewModelInstances.get(modelName);
  }

  updateViewModels() {
    const datasetService = this.datasetWorkflow.getDatasetService();

    this.viewModelInstances.forEach((model: AbstractEditViewModel) =>
      model.updateModel(datasetService.dataset),
    );
  }

  get dataset(): DatasetDTO | undefined {
    const datasetService = this.datasetWorkflow.getDatasetService();
    return datasetService?.dataset;
  }
}
