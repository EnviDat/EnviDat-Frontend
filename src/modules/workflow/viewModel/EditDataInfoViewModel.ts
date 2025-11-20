import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

import { DATE_PROPERTY_DATE_TYPE, DATE_PROPERTY_END_DATE, DATE_PROPERTY_START_DATE } from '@/factories/metadataConsts';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export class EditDataInfoViewModel extends AbstractEditViewModel {
  declare dates: string;

  validationErrors: {
    dates: string | null;
  } = {
    dates: null,
  };

  validationRules = yup.object().shape({
    // dates validation is done the in the BaseStartEndDate component
    dates: yup
      .array()
      .required('Created date is required')
      .min(1, 'At least a creation date is required')
      .test(
        'empty-check',
        'Add start and end date',
        (dateEntry) => dateEntry[DATE_PROPERTY_START_DATE] !== '' && dateEntry[DATE_PROPERTY_END_DATE] !== '',
      ),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, EditDataInfoViewModel.mappingRules());
  }

  static mappingRules() {
    return [['dates', 'date']];
  }

  static datesEntryMappingRules() {
    return [
      [DATE_PROPERTY_DATE_TYPE, 'date_type'],
      [DATE_PROPERTY_START_DATE, 'date'],
      [DATE_PROPERTY_END_DATE, 'end_date'],
    ];
  }

  validate(newProps?: Partial<EditDataInfoViewModel>): boolean {
    return super.validate(newProps);
  }
}
