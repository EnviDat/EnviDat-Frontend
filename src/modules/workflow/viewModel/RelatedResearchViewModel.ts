/* eslint-disable object-curly-newline */
import * as yup from 'yup';

import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

function convertEmptyStringToNull(v: unknown) {
  return typeof v === 'string' && v.trim() === '' ? null : v;
}

export class RelatedResearchViewModel extends AbstractEditViewModel {
  declare relatedPublicationsText: string | null;
  declare relatedDatasetsText: string | null;
  declare customFields: string;

  declare validationErrors: {
    relatedPublicationsText: string | null;
    relatedDatasetsText: string | null;
    customFields: string | null;
  };

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, RelatedResearchViewModel.mappingRules());

    this.validationErrors = {
      relatedPublicationsText: null,
      relatedDatasetsText: null,
      customFields: null,
    };

    this.validationRules = yup.object().shape({
      relatedPublicationsText: yup
        .string()
        .nullable()
        .transform(convertEmptyStringToNull)
        .min(
          10,
          'Write at least 10 characters to describe the related publications.',
        ),

      relatedDatasetsText: yup
        .string()
        .nullable()
        .transform(convertEmptyStringToNull)
        .min(
          10,
          'Write at least 10 characters to describe the related datasets.',
        ),

      customFields: yup
        .array()
        .default(() => [])
        .of(
          yup.object({
            fieldName: yup
              .string()
              .trim()
              .when('content', {
                is: (val: string | undefined) => val && val.trim() !== '',
                then: (schema) =>
                  schema
                    .required('Field name is required')
                    .min(3, 'Field name must be at least 3 characters'),
                otherwise: (schema) => schema.notRequired().nullable(),
              }),
            content: yup
              .string()
              .nullable()
              .transform(convertEmptyStringToNull),
          }),
        )
        .notRequired(),
    });
  }

  static mappingRules() {
    return [
      ['relatedPublicationsText', 'related_publications'],
      ['relatedDatasetsText', 'related_datasets'],
      ['customFields', 'extras'],
    ];
  }

/*
  getData() {
    return {
      relatedPublicationsText: this.relatedPublicationsText,
      relatedDatasetsText: this.relatedDatasetsText,
      customFields: this.customFields,
    };
  }
*/

  validate(newProps?: Partial<RelatedResearchViewModel>) {
    return super.validate(newProps);
  }
}
