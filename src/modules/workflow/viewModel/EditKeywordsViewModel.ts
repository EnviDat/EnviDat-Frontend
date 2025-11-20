import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { type DatasetDTO, KeywordDTO } from '@/types/dataTransferObjectsTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { ViewModelSaveEvent } from '@/types/workflow';

export class EditKeywordsViewModel extends AbstractEditViewModel {
  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare metadataTitle: string;
  declare metadataDescription: string;

  validationErrors: {
    keywords: string | null;
  } = {
    keywords: null,
  };

  validationRules = yup.object().shape({
    keywords: yup.array().min(5, 'Enter at least 5 keywords.'),
  });

  constructor(
    dataset: DatasetDTO | undefined,
    saveEventHook: ViewModelSaveEvent | undefined,
    existingKeywords: KeywordDTO[],
  ) {
    super(dataset, saveEventHook, EditKeywordsViewModel.mappingRules());

    enhanceKeywords(this.keywords, categoryCards);
    this.existingKeywords = existingKeywords;
  }

  static mappingRules() {
    return [
      ['keywords', 'tags'],
      ['metadataTitle', 'title'],
      ['metadataDescription', 'notes'],
    ];
  }

  validate(newProps?: Partial<EditKeywordsViewModel>): boolean {
    return super.validate(newProps);
  }
}
