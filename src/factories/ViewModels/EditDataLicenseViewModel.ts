import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';


export class EditDataLicenseViewModel extends AbstractEditViewModel{

  declare organizationId: string;

  declare validationErrors: {
    dataLicenseId: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditDataLicenseViewModel.mappingRules());


    this.validationErrors = {
      dataLicenseId: null,
    }

    this.validationRules =
      yup.object().shape({
        dataLicenseId: yup.string().required('Data licence is required'),
      });
  }

  static mappingRules () {
    return [
      ['dataLicenseId','license_id'],
      ['dataLicenseTitle','license_title'],
      ['dataLicenseUrl','license_url'],
    ];
  }

  validate(newProps?: any): boolean {

    return isObjectValidCheckAllProps(
      {
        dataLicenseId: newProps?.dataLicenseId || this.dataLicenseId,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
}

