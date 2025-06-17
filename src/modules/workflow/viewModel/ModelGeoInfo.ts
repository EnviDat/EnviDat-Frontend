// factories/ViewModels/ModelGeoInfo.ts
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';

export class ModelGeoInfo extends AbstractEditViewModel {
  declare dates: any[];
  declare geometries: any[];

  declare validationErrors: {
    dates: string | null;
    geometries: string | null;
  };

  constructor(datasetVM: DatasetViewModel) {
    super(datasetVM, ModelGeoInfo.mappingRules());

    this.validationErrors = { dates: null, geometries: null };

    this.validationRules = yup.object({
      dates: yup
        .array()
        .required('Created date is required')
        .min(1, 'At least a creation date is required')
        .test(
          'created-date-complete',
          'Add start **and** end date for “created”',
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
  }

  validate(newProps?: Partial<ModelGeoInfo>): boolean {
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
