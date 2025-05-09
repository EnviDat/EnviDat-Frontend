import * as yup from 'yup';
import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel.ts';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

export class EditPublicationViewModel extends AbstractEditViewModel{

  declare publicationState: string;
  declare doi: string;
  declare publisher: string;
  declare publicationYear: string;
  declare version: string;
  declare datasetId: string;

  declare validationErrors: {
    publicationState: string,
    doi: string,
    publisher: string,
    publicationYear: string,
    version: string,
    datasetId: string,
  }

  declare validationRules: object;


  constructor(datasetViewModel: DatasetViewModel) {
    super(datasetViewModel, EditPublicationViewModel.mappingRules());


    this.validationErrors = {
      publicationState: null,
      doi: null,
      publisher: null,
      publicationYear: null,
      version: null,
      datasetId: null,
    }

    this.validationRules =
      yup.object().shape({
        publicationState: yup.string(),
        doi: yup.string(),
        publisher: yup
          .string()
          .required('Enter publisher')
          .min(3),
        publicationYear: yup.string().required('Enter publication year'),
      });
  }

  static mappingRules () {
    return [
      ['publicationState','publication_state'],
      ['doi','doi'],
      ['publisher','publication.publisher'],
      ['publicationYear','publication.publication_year'],
      ['version', 'version'],
      ['datasetId', 'id'],
    ];
  }

  validate(newProps?: any): boolean {
    let propObj = newProps;

    if (!newProps) {
      propObj = {
        publicationState: this.publicationState,
        doi: this.doi,
        publisher: this.publisher,
        publicationYear: this.publicationYear,
        version: this.version,
        datasetId: this.datasetId,
      };
    }

    return isObjectValidCheckAllProps(
      propObj,
      this.validationRules,
      this.validationErrors,
    );
  }
}

