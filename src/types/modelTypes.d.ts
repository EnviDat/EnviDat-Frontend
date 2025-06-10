import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';


export interface DataCreditObject {
  curation: number;
  publication: number;
  software: number;
  supervision: number;
  validation: number;
  collection: number;
}

export interface Author {
  lastModified: string;
  firstName: string;
  lastName: string;
  email: string;
  dataCredit: string[];
  identifierType: string;
  identifier: string;
  affiliation: string;
  totalDataCredits: DataCreditObject;
  isSelected: boolean;
}

export interface Keyword {
  name: string;
}

/*
export interface DatasetModel {
  metadataTitle: string;
  contactEmail: string;
  metadataUrl: string;
  firstName: string;
  lastName: string;
  doi: string;
  id: string;
  keywords: Keyword[];
  authors: Author[];
  description: string;
}
*/

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  emailHash: string;
  created: string;
  modified: string;
  about: string;
  sysAdmin: boolean;
  state: string;
}


export interface DatasetServiceLayer {

  dataset: DatasetDTO;

  loadDataset(id: string) : Promise<DatasetDTO>;

  patchDatasetChanges(
    datasetId: string,
    viewModel: AbstractEditViewModel,
  ) : Promise<any>;

}
