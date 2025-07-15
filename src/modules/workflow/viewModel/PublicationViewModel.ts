import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


export class PublicationViewModel extends AbstractEditViewModel{

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


  constructor(datasetModel: DatasetModel) {
    super(datasetModel, PublicationViewModel.mappingRules());


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

  validate(newProps?: Partial<PublicationViewModel>): boolean {
    return super.validate(newProps);
  }
}

