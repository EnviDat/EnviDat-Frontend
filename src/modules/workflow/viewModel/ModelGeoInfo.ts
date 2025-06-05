// factories/ViewModels/ModelGeoInfo.ts
import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import {
  isFieldValid,
  isObjectValidCheckAllProps,
} from '@/factories/userEditingValidations';

export class ModelGeoInfo extends AbstractEditViewModel {
  declare dates: any[];
  declare geometries: any[];

  declare validationErrors: {
    dates: string | null;
    geometries: string | null;
  };

  declare validationRules: yup.AnyObjectSchema;

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
    if (!newProps) return true;

    let allValid = true;

    for (const [field, value] of Object.entries(newProps)) {
      const ok = isFieldValid(
        field,
        value,
        this.validationRules,
        this.validationErrors,
      );
      if (!ok) allValid = false;
    }

    return allValid;
  }

  static mappingRules() {
    return [
      ['dates', 'date'],
      ['geometries', 'geometries'],
    ];
  }
}
