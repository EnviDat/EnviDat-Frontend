import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

export class EditOrganizationViewModel extends AbstractEditViewModel{

  declare organizationId: string;

  declare validationErrors: {
    organizationId: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditOrganizationViewModel.mappingRules());


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

  validate(newProps?: any): boolean {

    return isObjectValidCheckAllProps(
      {
        organizationId: newProps.organizationId || this.organizationId,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
}

