import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export class EditOrganizationViewModel extends AbstractEditViewModel {
  declare organizationId: string;

  validationErrors: {
    organizationId: string | null;
  } = {
    organizationId: null,
  };

  validationRules = yup.object().shape({
    organizationId: yup
      .string()
      .required('selected an Organization')
      .test(
        'empty-check',
        'An organization must be selected.',
        (organizationId) => organizationId !== '',
        // Add validation - one of items in list
      ),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, EditOrganizationViewModel.mappingRules());
  }

  static mappingRules() {
    return [['organizationId', 'organization.id']];
  }

  validate(newProps?: Partial<EditOrganizationViewModel>): boolean {
    return super.validate(newProps);
  }
}
