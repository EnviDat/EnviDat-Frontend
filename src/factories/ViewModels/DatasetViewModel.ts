import { reactive } from 'vue';
import type { DatasetDTO } from '@/types/modelTypes';
import { DatasetServiceLayer } from '@/types/modelTypes';
import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel.ts';
import { EditDescriptionViewModel } from '@/factories/ViewModels/EditDescriptionViewModel.ts';
import { EditKeywordsViewModel } from '@/factories/ViewModels/EditKeywordsViewModel.ts';

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

    for (let i = 0; i < this.viewModelClasses.length; i++) {
      const VMClass = this.viewModelClasses[i];
      const instance = new VMClass(this);
      const reactiveVM = reactive(instance);

      this.viewModelInstances.set(instance.constructor.name, reactiveVM);
    }

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
