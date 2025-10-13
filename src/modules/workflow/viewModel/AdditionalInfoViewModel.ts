/*  AdditionalInfoViewModel.ts  */
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

const toNull = (v: string, o: string) => (o === '' ? null : v);

export class AdditionalInfoViewModel extends AbstractEditViewModel {
  declare dataLicenseId: string;
  declare dataLicenseTitle: string;
  declare dataLicenseUrl: string;
  declare organizationId: string | undefined;
  declare organization?: { id?: string; title?: string; name?: string };

  declare funders: {
    institution: string;
    grantNumber?: string;
    institutionUrl?: string | null;
  }[];

  validationErrors: {
    dataLicenseId: string | null;
    funders: string | null;
    organizationId: string | null;
  } = {
    dataLicenseId: null,
    funders: null,
    organizationId: null,
  };

  validationRules = yup.object().shape({
    dataLicenseId: yup.string().required('Data licence is required'),
    dataLicenseTitle: yup.string().nullable(),
    dataLicenseUrl: yup.string().nullable().url(),
    organizationId: yup.string().nullable(),
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

  constructor(datasetVM: DatasetModel) {
    super(datasetVM, AdditionalInfoViewModel.mappingRules());
  }

  validate(newProps?: Partial<AdditionalInfoViewModel>) {
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
      ['organizationId', 'organization.id'],
      ['organization', 'organization'],
      ['dataLicenseTitle', 'license_title'],
      ['dataLicenseUrl', 'license_url'],
      ['funders', 'funding'],
    ];
  }
}
