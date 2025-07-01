import { reactive, watch } from 'vue';
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { Author, DataCreditObject } from '@/types/modelTypes';
import { convertToFrontendJSONWithRules } from '@/factories/mappingFactory';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { AUTHOR_ASCII_DEAD } from '@/store/mainMutationsConsts';
import { getAuthorName } from '@/factories/authorFactory';

const convertEmptyStringToNull = (value: string, originalValue: string) =>
  originalValue === '' ? null : value;

export class AuthorViewModel extends AbstractEditViewModel implements Author {

  declare firstName: string;
  declare lastName: string;
  declare email: string;

  declare dataCredit: string[];
  declare totalDataCredits: DataCreditObject;

  declare identifierType: string;
  declare identifier: string;

  declare affiliation: string;
  declare lastModified: string;

  declare isSelected: boolean;

  declare validationErrors: {
    firstName: string,
    lastName: string;
    email: string;
    identifier: string;
    affiliation: string;
  }

  constructor(datasetViewModel?: DatasetModel | undefined) {
    // intentionally not providing the datasetViewModel, because resource have to be unpacked
    // from the list of resources, done in the ResourceListModel
    super(datasetViewModel, AuthorViewModel.mappingRules())


    this.validationErrors = {
      firstName: null,
      lastName: null,
      email: null,
      identifier: null,
      affiliation: null,
    }

    this.validationRules =
      yup.object().shape({
        firstName: yup
          .string()
          .required('Author first name is required')
          .min(2, 'Author first name must be at least 2 characters'),
        lastName: yup
          .string()
          .required('Author last name is required')
          .min(3, 'Author last name must be at least 3 characters'),
        email: yup
          .string()
          .email('Author email must be a valid email address')
          .required('Author email is required'),
        identifier: yup
          .string()
          .nullable()
          .transform(convertEmptyStringToNull)
          // e.g. 0000-0002-3862-8720
          .min(
            19,
            'OrcId must be at least 19 characters, like 0000-0002-3862-8720',
          ),
        affiliation: yup
          .string()
          // .required('Author affiliation is required')
          .min(3, 'Affiliation must be at least 3 characters'),
      });

  }

  get fullName() {
    return getAuthorName({ firstName: this.firstName, lastName: this.lastName });
  }

  get isAuthorDead() {
    return this.firstName?.includes(AUTHOR_ASCII_DEAD) || this.lastName?.includes(AUTHOR_ASCII_DEAD);
  }

  static getFormattedAuthor(rawAuthor: any, lastModified: string) : Author {
    const author = convertToFrontendJSONWithRules(AuthorViewModel.mappingRules(), rawAuthor) as Author;

    if (typeof author.dataCredit === 'string') {
      author.dataCredit = [author.dataCredit];
    }

    author.totalDataCredits = { collection: 0, curation: 0, publication: 0, software: 0, supervision: 0, validation: 0 };
    author.lastModified = lastModified;

    return author;
  }

  validate(newProps?: Partial<AuthorViewModel>) {
    return super.validate(newProps);
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


export const createAuthorViewModel = (author: Author, changeCallback = undefined) => {
  const authorVM = new AuthorViewModel();

  Object.assign(authorVM, author);

  const reactiveVM = reactive(authorVM);

  if (changeCallback) {
    watch(() => reactiveVM, (newModel) => {
      changeCallback(newModel);
    }, { deep: true });
  }

  return reactiveVM;
}
