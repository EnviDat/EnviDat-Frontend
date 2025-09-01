// factories/ViewModels/GeoInfoViewModel.ts
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

export class GeoInfoViewModel extends AbstractEditViewModel {

  declare dates: any[];
  declare geometries: any[];

  validationErrors: {
    dates: string | null;
    geometries: string | null;
  } = {
    dates: null,
    geometries: null,
  }

  validationRules = yup.object({
    dates: yup
      .array()
      .required('Created date is required')
      .min(1, 'At least a creation date is required')
      .test(
        'created-date-complete',
        'Add start and end date for “created”',
        (entries?: any[]) => {
          if (!Array.isArray(entries)) return false;

          const created = entries.find((e) => e.dateType === 'created');
          // deve esistere e avere entrambi i campi
          return !!created && created.dateStart && created.dateEnd;
        },
      ),
    geometries: yup
      .array()
      .required('Geometry is required')
      .min(1, 'At least one geometry is required'),
  });

  constructor(datasetVM: DatasetModel) {
    super(datasetVM, GeoInfoViewModel.mappingRules());
  }

  validate(newProps?: Partial<GeoInfoViewModel>): boolean {
    return super.validate(newProps);
  }

/*
  getData() {
    return {
      dates: this.dates,
      geometries: this.geometries,
    };
  }
*/

  static mappingRules() {
    return [
      ['dates', 'date'],
      ['geometries', 'geometries'],
    ];
  }
}
