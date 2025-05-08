import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';

export class EditDescriptionViewModel extends AbstractEditViewModel{

  declare description: string;

  declare validationErrors: {
    description: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditDescriptionViewModel.mappingRules());

    this.validationErrors = {
      description: null,
    }

    this.validationRules =
      yup.object().shape({
        description: yup
          .string()
          .required('Description is required')
          .min(100, 'Write at least a description with 100 characters.'),
      });
  }

  static mappingRules () {
    return [
      ['description','notes'],
    ];
  }

  validate(newProps?: any): boolean {
    return false;
  }
}

