import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export class AdminViewModel extends AbstractEditViewModel {
  declare customFields: string;
  // declare datasetProject: string;

  validationErrors: {
    customFields: string | null;
  } = {
    customFields: null,
  };

  validationRules = yup.object().shape({
    customFields: yup.array().of(
      yup.object({
        fieldName: yup.string().required().min(3),
        content: yup.string(),
      }),
    ),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, AdminViewModel.mappingRules());
  }

  static mappingRules() {
    return [['customFields', 'extras']];
  }

  validate(newProps?: Partial<AdminViewModel>): boolean {
    return super.validate(newProps);
  }
}
