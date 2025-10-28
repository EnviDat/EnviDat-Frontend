import { reactive, watch } from 'vue';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { AbstractViewModel } from '@/factories/ViewModels/AbstractViewModel.ts';

export class DescriptionViewModel extends AbstractViewModel {
  maxTextLength: number;

  declare description: string;

  constructor(dataset: DatasetDTO, smallScreen: boolean) {
    super(dataset, DescriptionViewModel.mappingRules());

    this.maxTextLength = smallScreen ? 900 : 1000;
  }

  static mappingRules() {
    return [['description', 'notes']];
  }
}

export const createDescriptionViewModel = (datasetDTO, smallScreen, changeCallback = undefined) => {
  const descVM = new DescriptionViewModel(datasetDTO, smallScreen);
  const reactiveVM = reactive(descVM);

  if (changeCallback) {
    watch(
      () => reactiveVM,
      (newModel) => {
        changeCallback(newModel);
      },
      { deep: true },
    );
  }

  return reactiveVM;
};
