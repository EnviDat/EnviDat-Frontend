import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';

export class EditKeywordsViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO) {
    super(datasetDTO, EditKeywordsViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['firstName','given_name'],
      ['lastName','name'],
      ['email','email'],
      ['dataCredit','data_credit'],
      ['identifierType','identifier_scheme'],
      ['identifier','identifier'],
      ['affiliation','affiliation'],
    ];
  }
}

