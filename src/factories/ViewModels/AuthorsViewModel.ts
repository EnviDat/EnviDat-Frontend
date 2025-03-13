import { reactive, watch } from 'vue';
import { Author, DatasetDTO } from '@/types/modelTypes';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';
import { EditAuthorViewModel } from '@/factories/ViewModels/EditAuthorViewModel.ts';

export class AuthorsViewModel extends AbstractBaseViewModel{

  constructor(dataset: DatasetDTO) {
    // don't provide dataset and mapping rules because authors
    // would get partially unpacked and then the unpacking of the full list
    // doesn't work anymore
    super();

    this.authors = AuthorsViewModel.getFormattedAuthors(dataset.author, dataset.metadata_modified);
  }

  authors: Author[];

  static getFormattedAuthors(rawAuthors: any[], lastModified: string) : Author[] {
    const formattedAuthors : Author[] = [];

    for (let i = 0; i < rawAuthors.length; i++) {
      const rawAuthor = rawAuthors[i];
      const author = EditAuthorViewModel.getFormattedAuthor(rawAuthor, lastModified);
      formattedAuthors.push(author);
    }

    return formattedAuthors;
  }

}

export const createAuthorsViewModel = (datasetDTO: DatasetDTO, changeCallback = undefined) => {
  const authorsVM = new AuthorsViewModel(datasetDTO);
  const reactiveAuthorsVM = reactive(authorsVM);

  watch(() => reactiveAuthorsVM, (newModel) => {
    if (changeCallback) {
      changeCallback(newModel);
    }
  }, { deep: true });

  return reactiveAuthorsVM;
}

