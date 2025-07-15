import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


const convertEmptyStringToNull = (value: string, originalValue: string) =>
  originalValue === '' ? null : value;


export class EditFundingViewModel extends AbstractEditViewModel{

  declare funders: string;

  declare validationErrors: {
    funders: string,
  }


  constructor(datasetModel: DatasetModel) {
    super(datasetModel, EditFundingViewModel.mappingRules());


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

  validate(newProps?: Partial<EditFundingViewModel>): boolean {
    return super.validate(newProps);
  }
}

