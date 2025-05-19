import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import type { KeywordDTO } from '@/types/modelTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';

export class ModelMetaDataHeader extends AbstractEditViewModel {
  declare metadataTitle: string;
  declare metadataDescription: string;
  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare validationErrors: {
    metadataTitle: string;
    metadataDescription: string;
    keywords: string;
  };

  declare validationRules: object;

  constructor(
    datasetViewModel: DatasetViewModel,
    existingKeywords: KeywordDTO[],
  ) {
    super(datasetViewModel, ModelMetaDataHeader.mappingRules());

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
      keywords: yup.array().min(5, 'Enter at least 5 keywords.'),
    });
  }

  validate(newProps: any | undefined = undefined) {
    let propObj = newProps;
    if (newProps) {
      propObj = {
        metadataTitle: newProps.metadataTitle,
        metadataDescription: newProps.metadataDescription,
        keywords: newProps.keywords,
      };
    } else {
      propObj = {
        metadataTitle: this.metadataTitle,
        metadataDescription: this.metadataDescription,
        keywords: this.keywords,
      };
    }

    return isObjectValidCheckAllProps(
      propObj,
      this.validationRules,
      this.validationErrors,
    );
  }

  static mappingRules() {
    return [
      ['metadataTitle', 'title'],
      ['metadataDescription', 'notes'],
      ['keywords', 'tags'],
    ];
  }
}
