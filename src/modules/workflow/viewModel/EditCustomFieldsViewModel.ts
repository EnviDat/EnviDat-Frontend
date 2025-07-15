import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


export class EditCustomFieldsViewModel extends AbstractEditViewModel{

  declare customFields: string;

  validationErrors: {
    customFields: string | null;
  } = {
    customFields: null,
  };

  validationRules =
    yup.object().shape({
      customFields: yup.array().of(
        yup.object({
          fieldName: yup
            .string()
            .required()
            .min(3),
          content: yup.string(),
        }),
      ),
    });


  constructor(datasetModel: DatasetModel) {
    super(datasetModel, EditCustomFieldsViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['customFields', 'extras'],
    ];
  }

  validate(newProps?: Partial<EditCustomFieldsViewModel>): boolean {
    return super.validate(newProps);
  }
}

