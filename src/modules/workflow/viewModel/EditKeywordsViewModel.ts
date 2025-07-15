import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { KeywordDTO } from '@/types/dataTransferObjectsTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


export class EditKeywordsViewModel extends AbstractEditViewModel{

  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare metadataTitle: string;
  declare metadataDescription: string;

  declare validationErrors: {
    keywords: string,
  }


  constructor(datasetModel: DatasetModel, existingKeywords: KeywordDTO[]) {
    super(datasetModel, EditKeywordsViewModel.mappingRules());

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

  validate(newProps?: Partial<EditKeywordsViewModel>): boolean {
    return super.validate(newProps);
  }
}

