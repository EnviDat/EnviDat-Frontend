import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/viewModel/DatasetModel.ts';

export class ModelPublicationInformation extends AbstractEditViewModel {
  declare contactEmail: string;
  declare contactFirstName: string;
  declare contactLastName: string;

  declare validationErrors: {
    contactEmail: string;
    contactFirstName: string;
    contactLastName: string;
  };

  constructor(datasetViewModel: DatasetModel) {
    super(datasetViewModel, ModelPublicationInformation.mappingRules());

    this.validationErrors = {
      contactEmail: null,
      contactFirstName: null,
      contactLastName: null,
    };

    this.validationRules = yup.object().shape({
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
  }

  validate(newProps?: Partial<ModelPublicationInformation>): boolean {
    return super.validate(newProps);
  }

/*
  getData() {
    return {
      contactEmail: this.contactEmail,
      contactFirstName: this.contactFirstName,
      contactLastName: this.contactLastName,
    };
  }
*/

  static mappingRules() {
    return [
      ['contactEmail', 'maintainer.email'],
      ['contactFirstName', 'maintainer.given_name'],
      ['contactLastName', 'maintainer.name'],
    ];
  }
}
