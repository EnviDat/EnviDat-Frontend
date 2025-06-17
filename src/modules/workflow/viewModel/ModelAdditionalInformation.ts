/*  ModelAdditionalInformation.ts  */
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/viewModel/DatasetModel.ts';

const toNull = (v: string, o: string) => (o === '' ? null : v);

export class ModelAdditionalInformation extends AbstractEditViewModel {
  declare dataLicenseId: string;
  declare dataLicenseTitle: string;
  declare dataLicenseUrl: string;

  declare funders: {
    institution: string;
    grantNumber?: string;
    institutionUrl?: string | null;
  }[];

  declare validationErrors: {
    dataLicenseId: string;
    funders: string;
  };

  constructor(datasetVM: DatasetModel) {
    super(datasetVM, ModelAdditionalInformation.mappingRules());

    this.validationErrors = { dataLicenseId: null, funders: null };

    this.validationRules = yup.object().shape({
      dataLicenseId: yup.string().required('Data licence is required'),

      funders: yup
        .array()
        .required('Enter funding information')
        .min(1, 'Provide at least one funding entry')
        .of(
          yup.object().shape({
            institution: yup.string().required().min(3),
            grantNumber: yup.string(),
            institutionUrl: yup
              .string()
              .nullable()
              .transform(toNull)
              .url('Provide a valid link / url.'),
          }),
        ),
    });
  }

  validate(newProps?: Partial<ModelAdditionalInformation>) {
    return super.validate(newProps);
  }

/*
  getData() {
    return {
      dataLicenseId: this.dataLicenseId,
      funders: this.funders,
    };
  }
*/

  static mappingRules() {
    return [
      ['dataLicenseId', 'license_id'],
      ['dataLicenseTitle', 'license_title'],
      ['dataLicenseUrl', 'license_url'],
      ['funders', 'funding'],
    ];
  }
}
