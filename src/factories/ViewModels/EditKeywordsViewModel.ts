import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';
import { DatasetDTO } from '@/types/modelTypes';

export class EditKeywordsViewModel extends AbstractBaseViewModel{

  declare keywords: any[];

  constructor(dataset: DatasetDTO) {
    super(dataset, EditKeywordsViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['keywords','tags'],
    ];
  }
}

