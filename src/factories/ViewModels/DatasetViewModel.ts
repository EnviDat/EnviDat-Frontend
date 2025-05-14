import { reactive } from 'vue';
import type { DatasetDTO } from '@/types/modelTypes';
import { DatasetServiceLayer } from '@/types/modelTypes';
import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel.ts';
import { EditDescriptionViewModel } from '@/factories/ViewModels/EditDescriptionViewModel.ts';
import { EditKeywordsViewModel } from '@/factories/ViewModels/EditKeywordsViewModel.ts';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';

export class DatasetViewModel {

  viewModelClasses = [
    EditHeaderViewModel,
    EditDescriptionViewModel,
    EditKeywordsViewModel,
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
    this.viewModelInstances.forEach((model) => model.updateModel(this.serviceLayer.dataset))
  }

  get dataset(): DatasetDTO | undefined {
    return this.serviceLayer?.dataset;
  }

}
