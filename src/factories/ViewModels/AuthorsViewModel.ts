import { reactive, watch } from 'vue';
import { Author } from '@/types/modelTypes';
import { AuthorDTO, DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { EditAuthorViewModel } from '@/factories/ViewModels/EditAuthorViewModel.ts';
import { AbstractViewModel } from '@/factories/ViewModels/AbstractViewModel.ts';

export class AuthorsViewModel extends AbstractViewModel {

  declare authors: Author[];

  constructor(dataset: DatasetDTO | undefined) {
    // don't provide dataset and mapping rules because authors
    // would get partially unpacked and then the unpacking of the full list
    // doesn't work anymore
    super();

    if (dataset) {
      this.authors = AuthorsViewModel.getFormattedAuthors(dataset.author, dataset.metadata_modified);
    }
  }

  static getFormattedAuthors(rawAuthors: AuthorDTO[], lastModified: string) : Author[] {
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

