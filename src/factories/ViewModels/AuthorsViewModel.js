import { reactive, watch } from 'vue';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

import { convertToFrontendJSONWithRules } from '@/factories/mappingFactory';

export class AuthorsViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO) {
    super(datasetDTO, ['authorsRaw', 'author']);

    this.authors = AuthorsViewModel.getFormattedAuthors(this.authorsRaw);

    if (typeof this.dataCredit === 'string') {
      this.dataCredit = [this.dataCredit];
    }

    this.totalDataCredits = {};
    this.lastModified = datasetDTO.metadata_modified;
  }

  static getFormattedAuthors(authorsRaw) {
    const formattedAuthors = [];

    for (let i = 0; i < authorsRaw.length; i++) {
      const author = authorsRaw[i];
      const frontendJson = convertToFrontendJSONWithRules(AuthorsViewModel.mappingRules(), author);
      formattedAuthors.push(frontendJson);
    }

    return formattedAuthors;
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
      /*
          ['affiliations.affiliation1','affiliation'],
          ['affiliations.affiliation2','affiliation_02'],
          ['affiliations.affiliation3','affiliation_03'],
      */
    ];
  }
}

export const createHeaderViewModel = (datasetDTO, changeCallback = undefined) => {
  const authorVM = new AuthorsViewModel(datasetDTO);
  const reactiveAuthorVM = reactive(authorVM);

  watch(() => reactiveAuthorVM, (newModel) => {
    if (changeCallback) {
      changeCallback(newModel);
    }
  }, { deep: true });

  return reactiveAuthorVM;
}

