import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';
import { DatasetDTO, KeywordDTO } from '@/types/modelTypes';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';

export class EditKeywordsViewModel extends AbstractBaseViewModel{

  declare keywords: KeywordDTO[];
  declare existingKeywords: KeywordDTO[];

  declare metadataTitle: string;
  declare metadataDescription: string;


  constructor(dataset: DatasetDTO, existingKeywords: KeywordDTO[]) {
    super(dataset, EditKeywordsViewModel.mappingRules());

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

