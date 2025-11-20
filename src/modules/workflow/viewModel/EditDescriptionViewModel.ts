import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export class EditDescriptionViewModel extends AbstractEditViewModel {
  declare description: string;

  validationErrors: {
    description: string | null;
  } = {
    description: null,
  };

  validationRules = yup.object().shape({
    description: yup
      .string()
      .required('Description is required')
      .min(100, 'Write at least a description with 100 characters.'),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, EditDescriptionViewModel.mappingRules());
  }

  static mappingRules() {
    return [['description', 'notes']];
  }

  validate(newProps?: Partial<EditDescriptionViewModel>): boolean {
    return super.validate(newProps);
  }
}
