import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';

import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import type { KeywordDTO } from '@/types/dataTransferObjectsTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';

export class MetadataBaseViewModel extends AbstractEditViewModel {
  declare metadataTitle: string;
  declare metadataDescription: string;
  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare validationErrors: {
    metadataTitle: string;
    metadataDescription: string;
    keywords: string;
  };

  constructor(
    datasetViewModel: DatasetModel,
    existingKeywords: KeywordDTO[],
  ) {
    super(datasetViewModel, MetadataBaseViewModel.mappingRules());

    enhanceKeywords(this.keywords, categoryCards);
    this.existingKeywords = existingKeywords;

    this.validationErrors = {
      metadataTitle: null,
      metadataDescription: null,
      keywords: null,
    };

    this.validationRules = yup.object().shape({
      metadataTitle: yup
        .string()
        .required('Dataset title is required')
        .min(5, 'Dataset title must be at least 5 characters')
        .max(180, 'Dataset title has a maximum of 180 characters')
        .matches(/^[\w\söüä-]+$/, 'Use only letters and numbers for the title'),
      metadataDescription: yup
        .string()
        .required('Dataset description is required')
        .min(20, 'Description must be at least 20 characters'),
      keywords: yup
        .array()
        .required('Keywords is required')
        .min(5, 'Enter at least 5 keywords.'),
    });
  }

  validate(newProps?: Partial<MetadataBaseViewModel>) {
    return super.validate(newProps);
  }

/*
  getData() {
    return {
      metadataTitle: this.metadataTitle,
      metadataDescription: this.metadataDescription,
      keywords: this.keywords,
    };
  }
*/

  static mappingRules() {
    return [
      ['metadataTitle', 'title'],
      ['metadataDescription', 'notes'],
      ['keywords', 'tags'],
    ];
  }
}
