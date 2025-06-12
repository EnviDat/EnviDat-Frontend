import * as yup from 'yup';

import { Author } from '@/types/modelTypes';
import { AuthorDTO } from '@/types/dataTransferObjectsTypes';
import {
  createAuthorViewModel,
  AuthorViewModel,
} from '@/modules/workflow/viewModel/AuthorViewModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { convertJSON, convertToBackendJSONWithRules, convertToFrontendJSONWithRules } from '@/factories/mappingFactory';

export class AuthorListViewModel extends AbstractEditViewModel {
  declare authors: Author[];

  declare validationErrors: {
    authors: string;
  };

  constructor(datasetViewModel: DatasetViewModel) {
    // don't provide dataset and mapping rules because authors
    // would get partially unpacked and then the unpacking of the full list
    // doesn't work anymore
    super(datasetViewModel, undefined);
    // super(datasetViewModel, AuthorListViewModel.mappingRules());
    // manually assign it so not to trigger the initial conversion
    this.privateMappingRules = AuthorListViewModel.mappingRules();

    if (datasetViewModel?.dataset?.author) {
      this.authors = AuthorListViewModel.getFormattedAuthors(datasetViewModel.dataset.author, datasetViewModel.dataset.metadata_modified);
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
      const author = AuthorViewModel.getFormattedAuthor(
        rawAuthor,
        lastModified,
      );
      formattedAuthors.push(author);
    }

    return formattedAuthors;
  }

  getAuthorViewModels(validateViewModels: boolean): AuthorViewModel[] | undefined {
    const rawAuthors = this.datasetViewModel.dataset.author;

    const authors: Author[] = AuthorListViewModel.getFormattedAuthors(
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

  validate(newProps?: Partial<AuthorListViewModel>): boolean {
    return super.validate(newProps);
  }

  static mappingRules() {
    return [['authors', 'author']];
  }
}

