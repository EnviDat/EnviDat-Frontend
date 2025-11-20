// factories/ViewModels/GeoInfoViewModel.ts
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export class GeoInfoViewModel extends AbstractEditViewModel {
  declare dates: any[];
  declare geometries: any[];

  validationErrors: {
    dates: string | null;
    geometries: string | null;
  } = {
    dates: null,
    geometries: null,
  };

  validationRules = yup.object({
    dates: yup
      .array()
      .ensure()
      .required('Created date is required')
      .min(1, 'At least a creation date is required')
      .test('created-date-complete', 'Add start and end date for “created”', (entries?: any[]) => {
        if (!Array.isArray(entries)) return false;

        const created = entries.find((e) => e.dateType === 'created');
        if (!created) return false;

        const start = created.date ?? created.dateStart;
        const end = created.endDate ?? created.dateEnd;

        return Boolean(start && end);
      }),
    geometries: yup.array().required('Geometry is required').min(1, 'At least one geometry is required'),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, GeoInfoViewModel.mappingRules());
  }

  public override getModelData(): {
    dates: string;
  } {
    const data = super.getModelData<GeoInfoViewModel>() as any;

    const { geometries, ...rest } = data;

    return rest as {
      dates: string;
    };
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
      ['geometries', 'spatial'],
    ];
  }
}
