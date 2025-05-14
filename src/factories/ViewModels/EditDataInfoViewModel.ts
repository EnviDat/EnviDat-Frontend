import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';
import { DATE_PROPERTY_DATE_TYPE, DATE_PROPERTY_END_DATE, DATE_PROPERTY_START_DATE } from '@/factories/metadataConsts';

export class EditDataInfoViewModel extends AbstractEditViewModel{

  declare dates: string;

  declare validationErrors: {
    dates: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditDataInfoViewModel.mappingRules());


    this.validationErrors = {
      dates: null,
    }

    

    this.validationRules =
      yup.object().shape({
        // dates validation is done the in the BaseStartEndDate component
        dates: yup
          .array()
          .required('Created date is required')
          .min(1, 'At least a creation date is required')
          .test(
            'empty-check',
            'Add start and end date',
            dateEntry =>
              dateEntry[DATE_PROPERTY_START_DATE] !== '' &&
              dateEntry[DATE_PROPERTY_END_DATE] !== '',
          ),
      });
  }

  static mappingRules () {
    return [
      ['dates','date'],
    ];
  }

  static datesEntryMappingRules() {
    return [
      [DATE_PROPERTY_DATE_TYPE, 'date_type'],
      [DATE_PROPERTY_START_DATE, 'date'],
      [DATE_PROPERTY_END_DATE, 'end_date'],
    ];
  }

  validate(newProps?: any): boolean {

    return isObjectValidCheckAllProps(
      {
        dates: newProps?.dates || this.dates,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
}

