import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/viewModel/DatasetModel.ts';


export class EditDataLicenseViewModel extends AbstractEditViewModel{

  declare organizationId: string;

  declare validationErrors: {
    dataLicenseId: string,
  }


  constructor(datasetViewModel: DatasetModel) {
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

  validate(newProps?: Partial<EditDataLicenseViewModel>): boolean {
    return super.validate(newProps);
  }
}

