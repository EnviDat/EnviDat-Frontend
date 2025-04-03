import * as yup from 'yup';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';
import { DatasetDTO } from '@/types/modelTypes';
import { isObjectValidAuto } from '@/factories/userEditingValidations';
import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';


export class EditHeaderViewModel extends AbstractBaseViewModel{

  declare metadataTitle: string;
  declare metadataUrl: string;

  declare contactEmail: string;
  declare contactFirstName: string;
  declare contactLastName: string;

  declare license: string;

  declare validationErrors: {
    metadataTitle: string,
    metadataUrl: string;
    contactEmail: string;
    contactFirstName: string;
    contactLastName: string;
  }

  declare validationRules: object;

  constructor(dataset: DatasetDTO) {
    super(dataset, EditHeaderViewModel.mappingRules());

    this.validationErrors = {
      metadataTitle: null,
      metadataUrl: null,
      contactEmail: null,
      contactFirstName: null,
      contactLastName: null,
    }

    this.validationRules =
      yup.object().shape({
        [METADATA_URL_PROPERTY]: yup
          .string()
          .nullable()
          .min(5, 'Dataset url must be at least 5 characters')
          .max(80, 'Dataset url has a maximum of 80 characters')
          .matches(
            /^[\w-]+$/,
            'Use only letters, numbers and dashes for the url (not spaces)',
          ),
        [METADATA_TITLE_PROPERTY]: yup
          .string()
          .required('Dataset title is required')
          .min(5, 'Dataset title must be at least 5 characters')
          .max(180, 'Dataset title has a maximum of 180 characters')
          .matches(/^[\w\söüä-]+$/, 'Use only letters and numbers for the title'),
        [METADATA_CONTACT_FIRSTNAME]: yup
          .string()
          .required('Contact given name is required')
          .min(3, 'Contact given (first) name must be at least 3 characters'),
        [METADATA_CONTACT_LASTNAME]: yup
          .string()
          .required('Contact surname is required')
          .min(3, 'Contact surname must be at least 3 characters'),
        [METADATA_CONTACT_EMAIL]: yup
          .string()
          .email('Contact email must be a valid email address')
          .required('Contact email is required'),
      });
  }

  validate() {
    return isObjectValidAuto(
      {
        metadataTitle: this.metadataTitle,
        metadataUrl: this.metadataUrl,
        contactEmail: this.contactEmail,
        contactFirstName: this.contactFirstName,
        contactLastName: this.contactLastName,
      },
      this.validationRules,
      this.validationErrors,
    );
  }

  save() {
    const isValid = this.validate();

    if (isValid) {
      console.log('EditHeaderViewModel saved');
      return;
    }
    console.log('EditHeaderViewModel NOT saved because validation failed!');
  }

  static mappingRules () {
    return [
      ['metadataTitle','title'],
      ['metadataUrl','name'],
      ['contactEmail','maintainer.email'],
      ['contactFirstName','maintainer.given_name'],
      ['contactLastName','maintainer.name'],
      ['license','license_title'],
    ];
  }
}
