import { computed, reactive } from 'vue';
import store from '@/store/store';

import type { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetService, Resource } from '@/types/modelTypes';

import { AdminViewModel } from '@/modules/workflow/viewModel/AdminViewModel.ts';
import { AuthorListViewModel } from '@/modules/workflow/viewModel/AuthorListViewModel.ts';
import { EditDataInfoViewModel } from '@/modules/workflow/viewModel/EditDataInfoViewModel.ts';
import { ResourcesListViewModel } from '@/modules/workflow/viewModel/ResourcesListViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { MetadataBaseViewModel } from '@/modules/workflow/viewModel/MetadataBaseViewModel.ts';
import { AdditionalInfoViewModel } from '@/modules/workflow/viewModel/AdditionalInfoViewModel.ts';
import { GeoInfoViewModel } from '@/modules/workflow/viewModel/GeoInfoViewModel.ts';
import { RelatedResearchViewModel } from '@/modules/workflow/viewModel/RelatedResearchViewModel.ts';
import { PublicationInfoViewModel } from '@/modules/workflow/viewModel/PublicationInfoViewModel.ts';
import { CustomFieldsViewModel } from '@/modules/workflow/viewModel/CustomFieldsViewModel.ts';

import { LOCAL_DATASET_KEY, METADATA_NEW_RESOURCE_ID } from '@/factories/metadataConsts';

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';
import { ResourceViewModel } from '@/modules/workflow/viewModel/ResourceViewModel.ts';

export class DatasetModel {
  viewModelClasses = [
    // needs to before ResourcesListViewModel as this is used by the ResourcesListViewModel
    CustomFieldsViewModel,
    AuthorListViewModel,
    AdminViewModel,
    EditDataInfoViewModel,
    MetadataBaseViewModel,
    AdditionalInfoViewModel,
    GeoInfoViewModel,
    RelatedResearchViewModel,
    PublicationInfoViewModel,
    ResourcesListViewModel,
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
      const instance = new VMClass(this.dataset, this.patchViewModel);

      if (instance instanceof MetadataBaseViewModel) {
        instance.existingKeywords = computed(() => store.getters['metadata/existingKeywords'] ?? []);
      }

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

  async createResourceOnExistingDataset(resourceModel: AbstractEditViewModel): Promise<ResourceDTO | undefined> {
    let newResource: ResourceDTO;
    resourceModel.loading = true;
    resourceModel.error = undefined;

    try {
      const datasetService = this.datasetWorkflow.getDatasetService();
      newResource = await datasetService.createResource(resourceModel.backendJSON);

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

  async saveDeprecatedResources(datasetId: string, resources: Resource[], datasetService: DatasetService) {
    const customFieldsVM = this.getViewModel('CustomFieldsViewModel');

    customFieldsVM.storeDeprecatedResources(resources.filter((res) => res.deprecated));

    await datasetService.patchDatasetChanges(datasetId, customFieldsVM.backendJSON);
  }

  private async saveResources(
    id: string,
    resourceListVM: ResourcesListViewModel,
    datasetService: DatasetService,
  ): Promise<void> {
    const newCreatedResource = resourceListVM.resources.filter(
      (res: Resource) => res.id === METADATA_NEW_RESOURCE_ID,
    )[0];

    if (newCreatedResource) {
      resourceListVM.loading = true;

      // create a temp model just to use the mapping
      const tempResourceModel = new ResourceViewModel(undefined, undefined);
      await tempResourceModel.save(newCreatedResource);

      // the resourceModel is updated with the latest content of the backend
      // (further details of the resource)
      await this.createResourceOnExistingDataset(tempResourceModel);

      eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

      resourceListVM.loading = false;
      return;
    }

    await datasetService.patchDatasetChanges(id, resourceListVM.backendJSON);

    return await this.saveDeprecatedResources(id, resourceListVM.resources, datasetService);
  }

  async patchViewModel(newModel: AbstractEditViewModel) {
    const id: string = this.datasetWorkflow.currentDatasetId?.trim() || LOCAL_DATASET_KEY;
    const datasetService = this.datasetWorkflow.getDatasetService();

    if (newModel instanceof ResourcesListViewModel) {
      await this.saveResources(id, newModel, datasetService);
    } else {
      await datasetService.patchDatasetChanges(id, newModel.backendJSON);
    }

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

    this.viewModelInstances.forEach((model: AbstractEditViewModel) => model.updateModel(datasetService.dataset));
  }

  get dataset(): DatasetDTO | undefined {
    const datasetService = this.datasetWorkflow.getDatasetService();
    return datasetService?.dataset;
  }
}
