import * as yup from 'yup';
import type { ComputedRef } from 'vue';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';

import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import type { KeywordDTO } from '@/types/dataTransferObjectsTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';

export class MetadataBaseViewModel extends AbstractEditViewModel {
  metadataTitle: string = '';
  metadataDescription: string = '';
  keywords: KeywordDTO[] = [];
  existingKeywords!: ComputedRef<KeywordDTO[]>;

  validationErrors: {
    metadataTitle: string | null;
    metadataDescription: string | null;
    keywords: string | null;
  } = {
    metadataTitle: null,
    metadataDescription: null,
    keywords: null,
  };

  validationRules = yup.object().shape({
    metadataTitle: yup
      .string()
      .required('Dataset title is required')
      .min(5, 'Dataset title must be at least 5 characters')
      .max(180, 'Dataset title has a maximum of 180 characters')
      .matches(/^[\w\söüä-]+$/, 'Use only letters and numbers for the title'),
    metadataDescription: yup
      .string()
      .required('Dataset description is required')
      .min(100, 'Description must be at least 100 characters'),
    keywords: yup
      .array()
      .required('Keywords is required')
      .min(5, 'Enter at least 5 keywords.'),
  });

  constructor(datasetModel: DatasetModel) {
    super(datasetModel, MetadataBaseViewModel.mappingRules());
    enhanceKeywords(this.keywords, categoryCards);
  }

  public override getModelData(): {
    metadataTitle: string;
    metadataDescription: string;
    keywords: KeywordDTO[];
  } {
    const data = super.getModelData<MetadataBaseViewModel>() as any;

    const { existingKeywords, ...rest } = data;

    return rest as {
      metadataTitle: string;
      metadataDescription: string;
      keywords: KeywordDTO[];
    };
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
