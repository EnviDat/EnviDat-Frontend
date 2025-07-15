import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


export class EditOrganizationViewModel extends AbstractEditViewModel{

  declare organizationId: string;

  declare validationErrors: {
    organizationId: string,
  }


  constructor(datasetModel: DatasetModel) {
    super(datasetModel, EditOrganizationViewModel.mappingRules());


    this.validationErrors = {
      organizationId: null,
    }

    this.validationRules =
      yup.object().shape({
        organizationId: yup
          .string()
          .required('selected an Organization')
          .test(
            'empty-check',
            'An organization must be selected.',
            organizationId => organizationId !== '',
            // Add validation - one of items in list
          ),
      });
  }

  static mappingRules () {
    return [
      ['organizationId', 'organization.id'],
    ];
  }

  validate(newProps?: Partial<EditOrganizationViewModel>): boolean {
    return super.validate(newProps);
  }
}

