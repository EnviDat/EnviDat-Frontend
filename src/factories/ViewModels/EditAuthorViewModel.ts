import { reactive, watch } from 'vue';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';
import { Author, DatasetDTO } from '@/types/modelTypes';
import { convertToFrontendJSONWithRules } from '@/factories/mappingFactory';


export class EditAuthorViewModel extends AbstractBaseViewModel{

  constructor(dataset: DatasetDTO) {
    super(dataset, EditAuthorViewModel.mappingRules());
  }

  static getFormattedAuthor(rawAuthor: any, lastModified: string) : Author {
    const author = convertToFrontendJSONWithRules(EditAuthorViewModel.mappingRules(), rawAuthor) as Author;

    if (typeof author.dataCredit === 'string') {
      author.dataCredit = [author.dataCredit];
    }

    author.totalDataCredits = {};
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
