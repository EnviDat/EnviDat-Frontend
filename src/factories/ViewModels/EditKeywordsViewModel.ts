import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { KeywordDTO } from '@/types/modelTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';

export class EditKeywordsViewModel extends AbstractEditViewModel{

  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare metadataTitle: string;
  declare metadataDescription: string;


  constructor(datasetViewModel: DatasetViewModel, existingKeywords: KeywordDTO[]) {
    super(datasetViewModel, EditKeywordsViewModel.mappingRules());

    enhanceKeywords(this.keywords, categoryCards)
    this.existingKeywords = existingKeywords;
  }

  static mappingRules () {
    return [
      ['keywords','tags'],
      ['metadataTitle','title'],
      ['metadataDescription','notes'],
    ];
  }
}

