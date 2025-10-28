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

  validationErrors: {
    relatedPublicationsText: string | null;
    relatedDatasetsText: string | null;
  } = {
    relatedPublicationsText: null,
    relatedDatasetsText: null,
  };

  validationRules = yup.object().shape({
    relatedPublicationsText: yup
      .string()
      .nullable()
      .transform(convertEmptyStringToNull)
      .min(10, 'Write at least 10 characters to describe the related publications.'),

    relatedDatasetsText: yup
      .string()
      .nullable()
      .transform(convertEmptyStringToNull)
      .min(10, 'Write at least 10 characters to describe the related datasets.'),
  });

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, RelatedResearchViewModel.mappingRules());
  }

  static mappingRules() {
    return [
      ['relatedPublicationsText', 'related_publications'],
      ['relatedDatasetsText', 'related_datasets'],
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
