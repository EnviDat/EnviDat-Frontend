import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

export class EditKeywordsViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO) {
    super(datasetDTO, EditKeywordsViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['keywords','tags'],
    ];
  }
}

