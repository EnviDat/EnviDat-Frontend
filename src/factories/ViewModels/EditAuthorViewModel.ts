import { reactive, watch } from 'vue';
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { Author, DataCreditObject, DatasetDTO } from '@/types/modelTypes';
import { convertToFrontendJSONWithRules } from '@/factories/mappingFactory';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';


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

  declare validationErrors: {
    firstName: string,
    lastName: string;
    email: string;
    identifier: string;
    affiliation: string;
  }

  declare validationRules: object;

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditAuthorViewModel.mappingRules());

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
          // e.g. 0000-0002-3862-8720
          .notRequired()
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

  static getFormattedAuthor(rawAuthor: any, lastModified: string) : Author {
    const author = convertToFrontendJSONWithRules(EditAuthorViewModel.mappingRules(), rawAuthor) as Author;

    if (typeof author.dataCredit === 'string') {
      author.dataCredit = [author.dataCredit];
    }

    author.totalDataCredits = { collection: 0, curation: 0, publication: 0, software: 0, supervision: 0, validation: 0 };
    author.lastModified = lastModified;

    return author;
  }

  validate(newProps?: any) {
    let propObj = newProps;

    if (newProps) {
      propObj = {
        firstName: newProps.firstName,
        lastName: newProps.lastName,
        email: newProps.email,
        identifier: newProps.identifier,
        affiliation: newProps.affiliation,
      };
    } else {
      propObj = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        identifier: this.identifier,
        affiliation: this.affiliation,
      };
    }

    return isObjectValidCheckAllProps(
      propObj,
      this.validationRules,
      this.validationErrors,
    );
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


export const createAuthorViewModel = (dataset: DatasetViewModel, changeCallback = undefined) => {
  const authorVM = new EditAuthorViewModel(dataset);
  const reactiveVM = reactive(authorVM);

  if (changeCallback) {
    watch(() => reactiveVM, (newModel) => {
      changeCallback(newModel);
    }, { deep: true });
  }

  return reactiveVM;
}
