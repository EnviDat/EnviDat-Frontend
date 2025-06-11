import { reactive } from 'vue';

import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetService, User } from '@/types/modelTypes';

import { EditHeaderViewModel } from '@/modules/workflow/viewModel/EditHeaderViewModel.ts';
import { EditDescriptionViewModel } from '@/modules/workflow/viewModel/EditDescriptionViewModel.ts';
import { EditKeywordsViewModel } from '@/modules/workflow/viewModel/EditKeywordsViewModel.ts';
import { EditCustomFieldsViewModel } from '@/modules/workflow/viewModel/EditCustomFieldsViewModel.ts';
import { EditAuthorListViewModel } from '@/modules/workflow/viewModel/EditAuthorListViewModel.ts';
import { EditDataInfoViewModel } from '@/modules/workflow/viewModel/EditDataInfoViewModel.ts';
import { EditDataLicenseViewModel } from '@/modules/workflow/viewModel/EditDataLicenseViewModel.ts';
import { EditPublicationViewModel } from '@/modules/workflow/viewModel/EditPublicationViewModel.ts';
import { ResourcesListModel } from '@/modules/workflow/viewModel/ResourcesListModel.ts';
import { ResourceModel } from '@/modules/workflow/viewModel/ResourceModel.ts';
import { EditOrganizationViewModel } from '@/modules/workflow/viewModel/EditOrganizationViewModel.ts';
import { EditFundingViewModel } from '@/modules/workflow/viewModel/EditFundingViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { ModelMetaDataHeader } from '@/modules/workflow/viewModel/ModelMetaDataHeader.ts';
import { ModelAdditionalInformation } from '@/modules/workflow/viewModel/ModelAdditionalInformation.ts';
import { ModelGeoInfo } from '@/modules/workflow/viewModel/ModelGeoInfo.ts';
import { ModelRelatedResearch } from '@/modules/workflow/viewModel/ModelRelatedResearch.ts';

import { initCreationDataWithDefaults } from '@/factories/userCreationFactory';
import { Dataset } from '@/modules/workflow/viewModel/Dataset.ts';
import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus';

export class DatasetViewModel {
  viewModelClasses = [
    EditHeaderViewModel,
    EditDescriptionViewModel,
    EditFundingViewModel,
    EditKeywordsViewModel,
    EditAuthorListViewModel,
    EditCustomFieldsViewModel,
    EditDataInfoViewModel,
    EditDataLicenseViewModel,
    EditPublicationViewModel,
    ResourcesListModel,
    ResourceModel,
    EditOrganizationViewModel,
    ModelMetaDataHeader,
    ModelAdditionalInformation,
    ModelGeoInfo,
    ModelRelatedResearch,
  ];

  private viewModelInstances: Map<string, any> = new Map();

  declare backendService: DatasetService;
  declare localStorageService: DatasetService;

  constructor(backendService: DatasetService, localStorageService: DatasetService) {
    this.backendService = backendService;
    this.localStorageService = localStorageService;

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

  async loadViewModels(datasetId: string): Promise<void> {
    await this.backendService.loadDataset(datasetId);

    this.createViewModels();
  }

  createDataset(user: User, prefilledOrganizationId: string) : DatasetDTO {

    const localId = `${user.id}_${prefilledOrganizationId}`;
    const predefinedData = {
      id: localId,
    };

    initCreationDataWithDefaults(predefinedData, user, prefilledOrganizationId);

    const localDataset = new Dataset(predefinedData);

    this.localStorageService.patchDatasetChanges(localId, localDataset);

    // @ts-ignore
    return localDataset;
  }


  async patchViewModel(newModel: AbstractEditViewModel) {
    try {
      newModel.loading = true;

      await this.backendService.patchDatasetChanges(this.dataset.id, newModel.backendJSON);

      this.updateViewModels();

      newModel.savedSuccessful = true;

      // send the clearing to the UI components to clear their internal state
      // this still needs to be resolved in a better way, but for now it's done vie the eventBus
      // because there is no direct connection to the UI components here (and should not be)
      // eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
    } catch (e) {
      newModel.savedSuccessful = false;
      newModel.error = e;

      console.error(e);
    }

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
    this.viewModelInstances.forEach((model) =>
      model.updateModel(this.backendService.dataset),
    );
  }

  get dataset(): DatasetDTO | undefined {
    return this.backendService?.dataset;
  }
}
