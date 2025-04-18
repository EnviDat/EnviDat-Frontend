import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';
import { DatasetDTO } from '@/types/modelTypes';

export class EditDescriptionViewModel extends AbstractBaseViewModel{

  declare description: string;

  constructor(dataset: DatasetDTO) {
    super(dataset, EditDescriptionViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['description','notes'],
    ];
  }
}

