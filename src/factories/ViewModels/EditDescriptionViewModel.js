import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';

export class EditDescriptionViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO) {
    super(datasetDTO, EditDescriptionViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['description','notes'],
    ];
  }
}

