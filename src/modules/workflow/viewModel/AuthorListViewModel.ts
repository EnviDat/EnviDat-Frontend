import * as yup from 'yup';

import { Author } from '@/types/modelTypes';
import { AuthorDTO, type DatasetDTO } from '@/types/dataTransferObjectsTypes';
import {
  AuthorViewModel,
  createAuthorViewModel,
} from '@/modules/workflow/viewModel/AuthorViewModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import {
  convertJSON,
  convertToBackendJSONWithRules,
  convertToFrontendJSONWithRules,
} from '@/factories/mappingFactory';

export class AuthorListViewModel extends AbstractEditViewModel {
  declare authors: Author[];

  declare lastModified: string;

  declare validationErrors: {
    authors: string;
  };

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, AuthorListViewModel.mappingRules());

/*
    // don't provide dataset and mapping rules because authors
    // would get partially unpacked and then the unpacking of the full list
    // doesn't work anymore
    super(datasetViewModel, undefined);
    // super(datasetViewModel, AuthorListViewModel.mappingRules());
    // manually assign it so not to trigger the initial conversion
    this.privateMappingRules = AuthorListViewModel.mappingRules();
*/

    if (datasetViewModel?.dataset?.author) {
      this.authors = AuthorListViewModel.getFormattedAuthors(
        datasetViewModel.dataset.author,
        datasetViewModel.dataset.metadata_modified,
      );
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

  getAuthorViewModels(
    validateViewModels: boolean,
  ): AuthorViewModel[] | undefined {
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

  get backendJSON() {
    const rawAuthors = this.authors.map((cleanAuthor) =>
      convertToBackendJSONWithRules(
        AuthorViewModel.mappingRules(),
        cleanAuthor,
      ));

    // needs to be "author" here check the mappingRules
    return convertJSON({ author: rawAuthors }, true);
  }

  /**
   * OVERRIDE the method because if it's done directly with then
   * e.g given_name get turned into givenName and then other mappingRules
   * break, like the ones from the AuthorViewModel
   * @param dataset
   */
  updateModel(dataset: DatasetDTO) {
    const frontendJson = convertToFrontendJSONWithRules(
      this.mappingRules,
      dataset,
      // we need this here to preserve the snake_case, so the mappingRules
      // of the AuthorViewModel still apply
      false,
    );

    const cleanAuthors = AuthorListViewModel.getFormattedAuthors(
      frontendJson.authors,
      frontendJson.lastModified,
    );

    Object.assign(this, { authors: cleanAuthors });
  }

  static mappingRules() {
    return [
      ['authors', 'author'],
      ['lastModified', 'metadata_modified'],
    ];
  }
}
