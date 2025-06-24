import { reactive } from 'vue';

import type { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetService, User } from '@/types/modelTypes';

import { EditHeaderViewModel } from '@/modules/workflow/viewModel/EditHeaderViewModel.ts';
import { EditDescriptionViewModel } from '@/modules/workflow/viewModel/EditDescriptionViewModel.ts';
import { EditKeywordsViewModel } from '@/modules/workflow/viewModel/EditKeywordsViewModel.ts';
import { EditCustomFieldsViewModel } from '@/modules/workflow/viewModel/EditCustomFieldsViewModel.ts';
import { AuthorListViewModel } from '@/modules/workflow/viewModel/AuthorListViewModel.ts';
import { EditDataInfoViewModel } from '@/modules/workflow/viewModel/EditDataInfoViewModel.ts';
import { EditDataLicenseViewModel } from '@/modules/workflow/viewModel/EditDataLicenseViewModel.ts';
import { EditPublicationViewModel } from '@/modules/workflow/viewModel/EditPublicationViewModel.ts';
import { ResourcesListModel } from '@/modules/workflow/viewModel/ResourcesListModel.ts';
import { EditOrganizationViewModel } from '@/modules/workflow/viewModel/EditOrganizationViewModel.ts';
import { EditFundingViewModel } from '@/modules/workflow/viewModel/EditFundingViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { ModelMetaDataHeader } from '@/modules/workflow/viewModel/ModelMetaDataHeader.ts';
import { ModelAdditionalInformation } from '@/modules/workflow/viewModel/ModelAdditionalInformation.ts';
import { ModelGeoInfo } from '@/modules/workflow/viewModel/ModelGeoInfo.ts';
import { ModelRelatedResearch } from '@/modules/workflow/viewModel/ModelRelatedResearch.ts';
import { ModelPublicationInformation } from '@/modules/workflow/viewModel/ModelPublicationInformation.ts';

import { initCreationDataWithDefaults } from '@/factories/userCreationFactory';
import { Dataset } from '@/modules/workflow/viewModel/Dataset.ts';
import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';

export class DatasetModel {
  viewModelClasses = [
    EditHeaderViewModel,
    EditDescriptionViewModel,
    EditFundingViewModel,
    EditKeywordsViewModel,
    AuthorListViewModel,
    EditCustomFieldsViewModel,
    EditDataInfoViewModel,
    EditDataLicenseViewModel,
    EditPublicationViewModel,
    ResourcesListModel,
    EditOrganizationViewModel,
    ModelMetaDataHeader,
    ModelAdditionalInformation,
    ModelGeoInfo,
    ModelRelatedResearch,
    ModelPublicationInformation,
  ];

  private viewModelInstances: Map<string, any> = new Map();

  declare datasetService: DatasetService;

  declare resourceCounter: number;

  constructor(datasetService: DatasetService) {
    this.datasetService = datasetService;
    this.resourceCounter = 0;

    this.createViewModels();
  }

  private clearViewModels(): void {
    this.viewModelInstances = new Map<string, any>();
  }

  private createViewModels() {
    this.clearViewModels();

    for (let i = 0; i < this.viewModelClasses.length; i++) {
      const VMClass = this.viewModelClasses[i];
      const instance = new VMClass(this);
      const reactiveVM = reactive(instance);

      this.viewModelInstances.set(instance.constructor.name, reactiveVM);
    }
  }

  /*
  async loadViewModels(datasetId: string): Promise<void> {
    await this.datasetService.loadDataset(datasetId);

    this.createViewModels();
  }
*/

  async loadDataset(datasetId: string): Promise<DatasetDTO> {
    await this.datasetService.loadDataset(datasetId);
    this.updateViewModels();
    return this.datasetService.dataset;
  }

  async reloadDataset(): Promise<DatasetDTO> {
    return this.loadDataset(this.datasetService.dataset.id);
  }

  async createDataset(
    user: User,
    prefilledOrganizationId: string,
  ): Promise<DatasetDTO> {
    const localId = `${user.id}_${prefilledOrganizationId}`;
    const predefinedData = {
      id: localId,
    };

    initCreationDataWithDefaults(predefinedData, user, prefilledOrganizationId);

    const localDataset = new Dataset(predefinedData);

    await this.datasetService.patchDatasetChanges(localId, localDataset);

    // @ts-ignore
    return localDataset;
  }

  async createResourceOnExistingDataset(resourceModel: AbstractEditViewModel) {
    resourceModel.loading = true;
    resourceModel.error = undefined;

    try {
      await this.datasetService.createResource(
        {
          ...resourceModel.backendJSON as ResourceDTO,
          // DEMO: this is set in the backend, only for local storage is needed
          id: `resource_id_${ this.resourceCounter }`,
          'package_id': this.dataset?.id,
        },
      );

      this.resourceCounter++; // DEMO

      // update specifically the ResourcesListModel with the newly created Resource
      this.getViewModel('ResourcesListModel').updateModel(this.dataset);

/*
      const resourceModelData =
        ResourceModel.getFormattedResource(
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
    await this.datasetService.patchDatasetChanges(
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
    this.viewModelInstances.forEach((model: AbstractEditViewModel) =>
      model.updateModel(this.datasetService.dataset),
    );
  }

  get dataset(): DatasetDTO | undefined {
    return this.datasetService?.dataset;
  }
}
