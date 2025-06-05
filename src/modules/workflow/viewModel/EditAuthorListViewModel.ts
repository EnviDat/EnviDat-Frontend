import { reactive, watch } from 'vue';
import * as yup from 'yup';

import { Author } from '@/types/modelTypes';
import { AuthorDTO } from '@/types/dataTransferObjectsTypes';
import {
  createAuthorViewModel,
  EditAuthorViewModel,
} from '@/modules/workflow/viewModel/EditAuthorViewModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';

export class EditAuthorListViewModel extends AbstractEditViewModel {
  declare authors: Author[];

  declare validationErrors: {
    authors: string;
  };

  constructor(datasetViewModel: DatasetViewModel) {
    // don't provide dataset and mapping rules because authors
    // would get partially unpacked and then the unpacking of the full list
    // doesn't work anymore
    super(datasetViewModel);
    // super(datasetViewModel, EditAuthorListViewModel.mappingRules());

    if (datasetViewModel?.dataset?.author) {
      this.authors = EditAuthorListViewModel.getFormattedAuthors(datasetViewModel.dataset.author, datasetViewModel.dataset.metadata_modified);
    } else {
      this.authors = [];
    }

    this.validationErrors = {
      authors: null,
    };

    this.validationRules = yup.object().shape({
      authors: yup.array().min(1, 'Add at least one author.'),
    });
  }

  static getFormattedAuthors(
    rawAuthors: AuthorDTO[],
    lastModified: string,
  ): Author[] {
    const formattedAuthors: Author[] = [];

    for (let i = 0; i < rawAuthors.length; i++) {
      const rawAuthor = rawAuthors[i];
      const author = EditAuthorViewModel.getFormattedAuthor(
        rawAuthor,
        lastModified,
      );
      formattedAuthors.push(author);
    }

    return formattedAuthors;
  }

  getEditAuthorViewModels(validateViewModels: boolean): EditAuthorViewModel[] | undefined {
    const rawAuthors = this.datasetViewModel.dataset.author;

    const authors: Author[] = EditAuthorListViewModel.getFormattedAuthors(
      rawAuthors,
      undefined,
    );

    return authors?.map((author) => {
      const vm = createAuthorViewModel(author);
      if (validateViewModels) {
        vm.validate();
      }
      return vm;
    });
  }

  validate(newProps?: Partial<EditAuthorListViewModel>): boolean {
    return super.validate(newProps);
  }
/*
  validate(newProps?: any): boolean {
    return isObjectValidCheckAllProps(
      {
        authors: newProps.authors || this.authors,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
*/

  static mappingRules() {
    return [['authors', 'author']];
  }
}

export const createEditAuthorListViewModel = (
  datasetViewModel: DatasetViewModel,
  changeCallback = undefined,
) => {
  const authorsVM = new EditAuthorListViewModel(datasetViewModel);
  const reactiveAuthorsVM = reactive(authorsVM);

  watch(
    () => reactiveAuthorsVM,
    (newModel) => {
      if (changeCallback) {
        changeCallback(newModel);
      }
    },
    { deep: true },
  );

  return reactiveAuthorsVM;
};
