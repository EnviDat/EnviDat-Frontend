import { reactive } from 'vue';
import type { DatasetDTO } from '@/types/modelTypes';
import { DatasetServiceLayer } from '@/types/modelTypes';
import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel.ts';
import { EditDescriptionViewModel } from '@/factories/ViewModels/EditDescriptionViewModel.ts';
import { EditKeywordsViewModel } from '@/factories/ViewModels/EditKeywordsViewModel.ts';
import { EditCustomFieldsViewModel } from '@/factories/ViewModels/EditCustomFieldsViewModel.ts';
import { EditAuthorViewModel } from '@/factories/ViewModels/EditAuthorViewModel.ts';
import { EditDataInfoViewModel } from '@/factories/ViewModels/EditDataInfoViewModel.ts';
import { EditDataLicenseViewModel } from '@/factories/ViewModels/EditDataLicenseViewModel.ts';
import { EditPublicationViewModel } from '@/factories/ViewModels/EditPublicationViewModel.ts';
import { EditResourceViewModel } from '@/factories/ViewModels/EditResourceViewModel.ts';
import { EditOrganizationViewModel } from '@/factories/ViewModels/EditOrganizationViewModel.ts';
import { EditFundingViewModel } from '@/factories/ViewModels/EditFundingViewModel.ts';

export class DatasetViewModel {

  viewModelClasses = [
    EditHeaderViewModel,
    EditDescriptionViewModel,
    EditFundingViewModel,
    EditKeywordsViewModel,
    EditAuthorViewModel,
    EditCustomFieldsViewModel,
    EditDataInfoViewModel,
    EditDataLicenseViewModel,
    EditPublicationViewModel,
    EditResourceViewModel,
    EditOrganizationViewModel,
  ];

  private viewModelInstances: Map<string, any> = new Map();

  declare serviceLayer : DatasetServiceLayer;

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

    const newDataset = this.serviceLayer.loadDataset(datasetId);
    this.dataset = newDataset;

    this.createViewModels();
  }

  async patchViewModel(newModel) {

    try {
      newModel.loading = true;

      await this.serviceLayer.patchDatasetChanges(this.dataset.id, newModel);
      this.updateViewModels();

      newModel.savedSuccessful = true;
      newModel.loading = false;

    } catch (e) {
      newModel.savedSuccessful = false;
      newModel.loading = false;
      newModel.error = e;

      console.error(e);
    }

  }

  get viewModels() {
    return this.viewModelInstances;
  }

  getViewModel(modelName: string) {
    return this.viewModelInstances.get(modelName);
  }

  updateViewModels() {
    this.viewModelInstances.forEach((model) => model.updateModel(this.serviceLayer.dataset))
  }

  get dataset(): DatasetDTO | undefined {
    return this.serviceLayer?.dataset;
  }

}
