import { reactive, watch } from 'vue';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { Author, DataCreditObject, DatasetDTO } from '@/types/modelTypes';
import { convertToFrontendJSONWithRules } from '@/factories/mappingFactory';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';


export class EditAuthorViewModel extends AbstractEditViewModel{

  declare firstName: string;
  declare lastName: string;
  declare email: string;

  declare dataCredit: string[];
  declare totalDataCredits: DataCreditObject;

  declare identifierType: string;
  declare identifier: string;

  declare affiliation: string;
  declare lastModified: string;

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditAuthorViewModel.mappingRules());
  }

  static getFormattedAuthor(rawAuthor: any, lastModified: string) : Author {
    const author = convertToFrontendJSONWithRules(EditAuthorViewModel.mappingRules(), rawAuthor) as Author;

    if (typeof author.dataCredit === 'string') {
      author.dataCredit = [author.dataCredit];
    }

    author.totalDataCredits = { collection: 0, curation: 0, publication: 0, software: 0, supervision: 0, validation: 0 };
    author.lastModified = lastModified;

    return author;
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


export const createAuthorViewModel = (dataset: DatasetDTO, changeCallback = undefined) => {
  const authorVM = new EditAuthorViewModel(dataset);
  const reactiveVM = reactive(authorVM);

  if (changeCallback) {
    watch(() => reactiveVM, (newModel) => {
      changeCallback(newModel);
    }, { deep: true });
  }

  return reactiveVM;
}
