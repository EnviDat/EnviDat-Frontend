import * as yup from 'yup';

import { Author } from '@/types/modelTypes';
import { AuthorDTO, type DatasetDTO } from '@/types/dataTransferObjectsTypes';
import {
  AuthorViewModel,
  createAuthorViewModel,
} from '@/modules/workflow/viewModel/AuthorViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import {
  convertJSON,
  convertToBackendJSONWithRules,
} from '@/factories/convertJSON';

export class AuthorListViewModel extends AbstractEditViewModel {
  declare authors: Author[];

  declare lastModified: string;

  validationErrors: {
    authors: string | null;
  } = {
    authors: null,
  };

  validationRules = yup.object().shape({
    authors: yup.array().min(1, 'Add at least one author.'),
  });


  constructor(datasetModel: DatasetModel) {
    super(datasetModel, AuthorListViewModel.mappingRules());
  }

  static getFormattedAuthors(
    rawAuthors: AuthorDTO[],
    lastModified: string,
  ): Author[] {
    const formattedAuthors: Author[] = [];

    for (let i = 0; i < rawAuthors?.length; i++) {
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
    const rawAuthors = this.datasetModel.dataset.author;

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

  /**
   * OVERRIDE the method because if it's done directly with then
   * e.g given_name get turned into givenName and then other mappingRules
   * break, like the ones from the AuthorViewModel
   */
  get backendJSON() {
    const rawAuthors = this.authors.map((cleanAuthor) =>
      convertToBackendJSONWithRules(
        AuthorViewModel.mappingRules(),
        cleanAuthor,
      ),
    );

    // needs to be "author" here check the mappingRules
    return convertJSON({ author: rawAuthors }, true);
  }

  /**
   * OVERRIDE the method because if it's done directly with then
   * e.g. given_name get turned into givenName and then other mappingRules
   * break, like the ones from the AuthorViewModel
   * @param dataset
   */
  updateModel(dataset: DatasetDTO | undefined) {
    if (!dataset) {
      // make sure to initialize for validations to work
      Object.assign(this, { authors: []});
      return;
    }

    const cleanAuthors = AuthorListViewModel.getFormattedAuthors(
      dataset.author,
      dataset.metadata_modified,
    );

    Object.assign(this, { authors: cleanAuthors });
  }

  getData() {
    return {
      authors: this.authors,
    };
  }

  static mappingRules() {
    return [
      ['authors', 'author'],
      ['lastModified', 'metadata_modified'],
    ];
  }
}
