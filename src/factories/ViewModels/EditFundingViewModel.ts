import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

const convertEmptyStringToNull = (value, originalValue) =>
  originalValue === '' ? null : value;

export class EditFundingViewModel extends AbstractEditViewModel{

  declare funders: string;

  declare validationErrors: {
    funders: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditFundingViewModel.mappingRules());


    this.validationErrors = {
      funders: null,
    }

    this.validationRules =
      yup.object().shape({
        funders: yup
          .array()
          .required('Enter funding information')
          .min(1, 'Provide at least one funding entry')
          .of(
            yup.object().shape({
              institution: yup
                .string()
                .required()
                .min(3),
              grantNumber: yup.string(),
              institutionUrl: yup
                .string()
                .nullable()
                .transform(convertEmptyStringToNull)
                .url(),
//              .matches(urlRegex, 'Provide a valid link / url.'),
            }),
          ),
      });
  }

  static mappingRules () {
    return [
      ['funders','funding'],
    ];
  }

  validate(newProps?: any): boolean {

    return isObjectValidCheckAllProps(
      {
        funders: newProps?.funders || this.funders,
      },
      this.validationRules,
      this.validationErrors,
    );
  }
}

