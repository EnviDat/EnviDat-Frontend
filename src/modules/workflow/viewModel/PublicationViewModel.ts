import * as yup from 'yup';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import type { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { ViewModelSaveEvent } from '@/types/workflow';

export class PublicationViewModel extends AbstractEditViewModel {
  declare publicationState: string;
  declare doi: string;
  declare publisher: string;
  declare publicationYear: string;
  declare version: string;
  declare datasetId: string;

  validationErrors: {
    publicationState: string | null;
    doi: string | null;
    publisher: string | null;
    publicationYear: string | null;
    version: string | null;
    datasetId: string | null;
  } = {
    publicationState: null,
    doi: null,
    publisher: null,
    publicationYear: null,
    version: null,
    datasetId: null,
  };

  validationRules = yup.object().shape({
    publicationState: yup.string(),
    doi: yup.string(),
    publisher: yup.string().required('Enter publisher').min(3),
    publicationYear: yup.string().required('Enter publication year'),
  });

  constructor(dataset: DatasetDTO | undefined, saveEventHook: ViewModelSaveEvent | undefined) {
    super(dataset, saveEventHook, PublicationViewModel.mappingRules());
  }

  static mappingRules() {
    return [
      ['publicationState', 'publication_state'],
      ['doi', 'doi'],
      ['publisher', 'publication.publisher'],
      ['publicationYear', 'publication.publication_year'],
      ['version', 'version'],
      ['datasetId', 'id'],
    ];
  }

  validate(newProps?: Partial<PublicationViewModel>): boolean {
    return super.validate(newProps);
  }
}
