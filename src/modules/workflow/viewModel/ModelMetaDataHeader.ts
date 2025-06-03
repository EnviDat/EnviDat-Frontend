import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import {
  isFieldValid,
  isObjectValidCheckAllProps,
} from '@/factories/userEditingValidations';
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
      keywords: yup
        .array()
        .required('Enter at least 5 keywords')
        .min(5, 'Enter at least 5 keywords.'),
    });
  }

  validateSingleField(newProps?: Partial<ModelMetaDataHeader>) {
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

  validate(newProps: any | undefined = undefined) {
    if (!newProps) {
      newProps = this;
    }
    console.log('validate');
    console.log(newProps);
    const propObj = {
      metadataTitle: newProps.metadataTitle,
      metadataDescription: newProps.metadataDescription,
      keywords: newProps.keywords,
    };

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
