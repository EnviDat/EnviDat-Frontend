/* eslint-disable object-curly-newline */
import * as yup from 'yup';

import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.ts';

function convertEmptyStringToNull(v: unknown) {
  return typeof v === 'string' && v.trim() === '' ? null : v;
}

export class ModelRelatedResearch extends AbstractEditViewModel {
  declare relatedPublicationsText: string | null;
  declare relatedDatasetsText: string | null;
  declare customFields: string;

  declare validationErrors: {
    relatedPublicationsText: string | null;
    relatedDatasetsText: string | null;
    customFields: string | null;
  };

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, ModelRelatedResearch.mappingRules());

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

      customFields: yup.array().of(
        yup.object({
          fieldName: yup.string().required().min(3),
          content: yup.string(),
        }),
      ),
    });
  }

  static mappingRules() {
    return [
      ['relatedPublicationsText', 'extras.related_publications'],
      ['relatedDatasetsText', 'extras.related_datasets'],
      ['customFields', 'extras'],
    ];
  }

  getData() {
    return {
      relatedPublicationsText: this.relatedPublicationsText,
      relatedDatasetsText: this.relatedDatasetsText,
      customFields: this.customFields,
    };
  }

  validate(newProps?: Partial<ModelRelatedResearch>) {
    return super.validate(newProps);
  }
}
