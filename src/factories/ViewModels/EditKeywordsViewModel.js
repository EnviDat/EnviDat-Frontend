import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';

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

