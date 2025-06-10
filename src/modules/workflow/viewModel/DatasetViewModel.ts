import { reactive } from 'vue';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetServiceLayer } from '@/types/modelTypes';
import { EditHeaderViewModel } from '@/modules/workflow/viewModel/EditHeaderViewModel.ts';
import { EditDescriptionViewModel } from '@/modules/workflow/viewModel/EditDescriptionViewModel.ts';
import { EditKeywordsViewModel } from '@/modules/workflow/viewModel/EditKeywordsViewModel.ts';
import { EditCustomFieldsViewModel } from '@/modules/workflow/viewModel/EditCustomFieldsViewModel.ts';
import { EditAuthorListViewModel } from '@/modules/workflow/viewModel/EditAuthorListViewModel.ts';
import { EditDataInfoViewModel } from '@/modules/workflow/viewModel/EditDataInfoViewModel.ts';
import { EditDataLicenseViewModel } from '@/modules/workflow/viewModel/EditDataLicenseViewModel.ts';
import { EditPublicationViewModel } from '@/modules/workflow/viewModel/EditPublicationViewModel.ts';
import { EditResourceViewModel } from '@/modules/workflow/viewModel/EditResourceViewModel.ts';
import { EditOrganizationViewModel } from '@/modules/workflow/viewModel/EditOrganizationViewModel.ts';
import { EditFundingViewModel } from '@/modules/workflow/viewModel/EditFundingViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { ModelMetaDataHeader } from '@/modules/workflow/viewModel/ModelMetaDataHeader.ts';
import { ModelAdditionalInformation } from '@/modules/workflow/viewModel/ModelAdditionalInformation.ts';
import { ModelGeoInfo } from '@/modules/workflow/viewModel/ModelGeoInfo.ts';
import { ModelRelatedResearch } from '@/modules/workflow/viewModel/ModelRelatedResearch.ts';

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
    EditResourceViewModel,
    EditOrganizationViewModel,
    ModelMetaDataHeader,
    ModelAdditionalInformation,
    ModelGeoInfo,
    ModelRelatedResearch,
  ];

  private viewModelInstances: Map<string, any> = new Map();

  declare serviceLayer: DatasetServiceLayer;

  constructor(serviceLayer: DatasetServiceLayer) {
    this.serviceLayer = serviceLayer;

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
    await this.serviceLayer.loadDataset(datasetId);

    this.createViewModels();
  }

  async patchViewModel(newModel: AbstractEditViewModel) {
    try {
      newModel.loading = true;

      await this.serviceLayer.patchDatasetChanges(this.dataset.id, newModel);
      this.updateViewModels();

      newModel.savedSuccessful = true;
    } catch (e) {
      newModel.savedSuccessful = false;
      newModel.error = e;

      console.error(e);
    }

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
      model.updateModel(this.serviceLayer.dataset),
    );
  }

  get dataset(): DatasetDTO | undefined {
    return this.serviceLayer?.dataset;
  }
}
