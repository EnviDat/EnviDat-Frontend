import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { KeywordDTO } from '@/types/modelTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

export class EditKeywordsViewModel extends AbstractEditViewModel{

  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare metadataTitle: string;
  declare metadataDescription: string;

  declare validationErrors: {
    keywords: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel, existingKeywords: KeywordDTO[]) {
    super(datasetViewModel, EditKeywordsViewModel.mappingRules());

    enhanceKeywords(this.keywords, categoryCards)
    this.existingKeywords = existingKeywords;

    this.validationErrors = {
      keywords: null,
    }

    this.validationRules =
      yup.object().shape({
        keywords: yup.array().min(5, 'Enter at least 5 keywords.'),
      });
  }

  static mappingRules () {
    return [
      ['keywords','tags'],
      ['metadataTitle','title'],
      ['metadataDescription','notes'],
    ];
  }

  validate(newProps?: any): boolean {

    return isObjectValidCheckAllProps(
      {
        keywords: newProps?.keywords || this.keywords,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
}

