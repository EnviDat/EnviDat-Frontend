import { reactive } from 'vue';

import type { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

import { EditDescriptionViewModel } from '@/modules/workflow/viewModel/EditDescriptionViewModel.ts';
import { EditCustomFieldsViewModel } from '@/modules/workflow/viewModel/EditCustomFieldsViewModel.ts';
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

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';

import store from '@/store/store';
import { reactive, computed } from 'vue';
import { User } from '@/types/modelTypes';

export class DatasetModel {
  viewModelClasses = [
    EditDescriptionViewModel,
    AuthorListViewModel,
    EditCustomFieldsViewModel,
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

/*
  async reloadDataset(): Promise<DatasetDTO> {
    return this.loadDataset(this.datasetService.dataset.id);
  }

  async createDataset(
    user: User,
    prefilledOrganizationId: string,
  ): Promise<DatasetDTO> {

    const datasetService = this.datasetWorkflow.getDatasetService();
    await datasetService.createDataset(localId, localDataset);

    // @ts-ignore
    return localDataset;
  }
*/

  async createResourceOnExistingDataset(resourceModel: AbstractEditViewModel) {
    resourceModel.loading = true;
    resourceModel.error = undefined;

    try {
      const datasetService = this.datasetWorkflow.getDatasetService();
      await datasetService.createResource({
        ...(resourceModel.backendJSON as ResourceDTO),
        // DEMO: this is set in the backend, only for local storage is needed
        id: `resource_id_${this.resourceCounter}`,
        package_id: this.dataset?.id,
      });

      this.resourceCounter++; // DEMO

      // update specifically the ResourcesListViewModel with the newly created Resource
      this.getViewModel('ResourcesListModel').updateModel(this.dataset);

      /*
      const resourceModelData =
        ResourceViewModel.getFormattedResource(
          newResourceDTO,
          this.dataset.name,
          undefined,
          undefined,
          undefined,
        );

      // don't use save as it would validate, directly overwrite the properties
      Object.assign(resourceModel, resourceModelData);
*/

      resourceModel.savedSuccessful = true;
    } catch (reason) {
      resourceModel.savedSuccessful = false;
      resourceModel.error = reason;
    }

    resourceModel.loading = false;
  }

  async patchViewModel(newModel: AbstractEditViewModel) {
    const datasetService = this.datasetWorkflow.getDatasetService();
    await datasetService.patchDatasetChanges(
      this.dataset.id,
      newModel.backendJSON,
    );

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
