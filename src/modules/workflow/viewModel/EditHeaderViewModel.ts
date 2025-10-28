import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


export class EditHeaderViewModel extends AbstractEditViewModel{

  declare metadataTitle: string;
  declare metadataUrl: string;

  declare contactEmail: string;
  declare contactFirstName: string;
  declare contactLastName: string;

  declare license: string;

  validationErrors: {
    metadataTitle: string | null;
    metadataUrl: string | null;
    contactEmail: string | null;
    contactFirstName: string | null;
    contactLastName: string | null;
    funders: string | null;
  } = {
    metadataTitle: null,
    metadataUrl: null,
    contactEmail: null,
    contactFirstName: null,
    contactLastName: null,
    funders: null,
  };

  validationRules =
    yup.object().shape({
      metadataUrl: yup
        .string()
        .nullable()
        .min(5, 'Dataset url must be at least 5 characters')
        .max(80, 'Dataset url has a maximum of 80 characters')
        .matches(
          /^[\w-]+$/,
          'Use only letters, numbers and dashes for the url (not spaces)',
        ),
      metadataTitle: yup
        .string()
        .required('Dataset title is required')
        .min(5, 'Dataset title must be at least 5 characters')
        .max(180, 'Dataset title has a maximum of 180 characters')
        .matches(/^[\w\söüä-]+$/, 'Use only letters and numbers for the title'),
      contactFirstName: yup
        .string()
        .required('Contact first name is required')
        .min(3, 'Contact first name must be at least 3 characters'),
      contactLastName: yup
        .string()
        .required('Contact last name is required')
        .min(3, 'Contact last name must be at least 3 characters'),
      contactEmail: yup
        .string()
        .required('Contact email is required')
        .email('Contact email must be a valid email address'),
    });


  constructor(datasetModel: DatasetModel) {
    super(datasetModel, EditHeaderViewModel.mappingRules());
  }

  validate(newProps?: Partial<EditHeaderViewModel>): boolean {
    return super.validate(newProps);
  }


  static mappingRules () {
    return [
      ['metadataTitle','title'],
      ['metadataUrl','name'],
      ['contactEmail','maintainer.email'],
      ['contactFirstName','maintainer.given_name'],
      ['contactLastName','maintainer.name'],
    ];
  }
}
