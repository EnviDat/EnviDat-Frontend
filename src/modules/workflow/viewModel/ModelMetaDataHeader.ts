import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';

export class ModelMetaDataHeader extends AbstractEditViewModel {
  declare metadataTitle: string;

  declare validationErrors: {
    metadataTitle: string;
  };

  declare validationRules: object;

  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, ModelMetaDataHeader.mappingRules());

    this.validationErrors = {
      metadataTitle: null,
    };

    this.validationRules = yup.object().shape({
      metadataTitle: yup
        .string()
        .required('Dataset title is required')
        .min(5, 'Dataset title must be at least 5 characters')
        .max(180, 'Dataset title has a maximum of 180 characters')
        .matches(/^[\w\söüä-]+$/, 'Use only letters and numbers for the title'),
    });
  }

  validate(newProps: any | undefined = undefined) {
    let propObj = newProps;
    if (newProps) {
      propObj = {
        metadataTitle: newProps.metadataTitle,
      };
    } else {
      propObj = {
        metadataTitle: this.metadataTitle,
      };
    }

    return isObjectValidCheckAllProps(
      propObj,
      this.validationRules,
      this.validationErrors,
    );
  }

  static mappingRules() {
    return [['metadataTitle', 'title']];
  }
}
