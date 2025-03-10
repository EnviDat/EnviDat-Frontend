import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

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

