import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


export class EditDescriptionViewModel extends AbstractEditViewModel{

  declare description: string;

  declare validationErrors: {
    description: string,
  }


  constructor(datasetViewModel: DatasetModel) {
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

  validate(newProps?: Partial<EditDescriptionViewModel>): boolean {
    return super.validate(newProps);
  }
}

