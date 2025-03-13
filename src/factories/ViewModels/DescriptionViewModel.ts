import { reactive, watch } from 'vue';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';

export class DescriptionViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO, smallScreen) {
    super(datasetDTO, DescriptionViewModel.mappingRules());

    this.maxTextLength = smallScreen ? 900 : 1000;
  }

  description: string;

  static mappingRules () {
    return [
      ['description','notes'],
    ];
  }
}

export const createDescriptionViewModel = (datasetDTO, smallScreen, changeCallback = undefined) => {
  const descVM = new DescriptionViewModel(datasetDTO, smallScreen);
  const reactiveVM = reactive(descVM);

  if (changeCallback) {
    watch(() => reactiveVM, (newModel) => {
        changeCallback(newModel);
    }, { deep: true });
  }

  return reactiveVM;
}

