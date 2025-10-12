import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

export class PublicationInfoViewModel extends AbstractEditViewModel {
  declare contactEmail: string;
  declare contactFirstName: string;
  declare contactLastName: string;
  declare organizationId: string;

  declare publicationState: string;
  declare doi: string;
  declare publisher: string;
  declare publicationYear: string;
  declare version: string;
  declare datasetId: string;

  validationErrors: {
    contactEmail: string | null;
    contactFirstName: string | null;
    contactLastName: string | null;
    organizationId: string | null;

    publicationState: string | null;
    doi: string | null;
    publisher: string | null;
    publicationYear: string | null;
    version: string | null;
    datasetId: string | null;
  } = {
    contactEmail: null,
    contactFirstName: null,
    contactLastName: null,
    organizationId: null,

    publicationState: null,
    doi: null,
    publisher: null,
    publicationYear: null,
    version: null,
    datasetId: null,
  };

  validationRules = yup.object().shape({
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

    publicationState: yup.string(),
    doi: yup.string(),
    publisher: yup.string().required('Enter publisher').min(3),
    publicationYear: yup.string().required('Enter publication year'),
    version: yup.string().nullable(),
    datasetId: yup.string().nullable(),

    organizationId: yup.string().nullable(),
  });

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, PublicationInfoViewModel.mappingRules());
  }

  static mappingRules() {
    return [
      ['contactEmail', 'maintainer.email'],
      ['contactFirstName', 'maintainer.given_name'],
      ['contactLastName', 'maintainer.name'],
      ['organizationId', 'organization.id'],
      ['publicationState', 'publication_state'],
      ['doi', 'doi'],
      ['publisher', 'publication.publisher'],
      ['publicationYear', 'publication.publication_year'],
      ['version', 'version'],
      ['datasetId', 'id'],
    ];
  }

  validate(newProps?: Partial<PublicationInfoViewModel>): boolean {
    return super.validate(newProps);
  }
}

export default PublicationInfoViewModel;
