import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

export class EditCustomFieldsViewModel extends AbstractEditViewModel{

  declare customFields: string;

  declare validationErrors: {
    customFields: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditCustomFieldsViewModel.mappingRules());


    this.validationErrors = {
      customFields: null,
    }

    this.validationRules =
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
  }

  static mappingRules () {
    return [
      ['customFields', 'extras'],
    ];
  }

  validate(newProps?: any): boolean {

    return isObjectValidCheckAllProps(
      {
        customFields: newProps.customFields || this.customFields,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
}

