import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';

export class EditDescriptionViewModel extends AbstractEditViewModel{

  declare description: string;

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditDescriptionViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['description','notes'],
    ];
  }
}

