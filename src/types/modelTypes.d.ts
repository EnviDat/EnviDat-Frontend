import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';


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

export interface User {
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

export interface Resource {
  // cacheLastUpdated: string | null;
  // cacheUrl: string | null;
  created: string;
  datasetId: string;
  description: string;
  doi: string;
  format: string;
  // hash: string;
  id: string;
  lastModified: string;
  metadataModified: string | null;
  mimetype: string;
  mimetypeInner: string | null;
  name: string;
  position: number;
  resourceSize: string;
  resourceType: string | null;
  restricted: string;
  restrictedUrl: string;
  size: number;
  sizeFormat: string;
  state: string;
  url: string;
  urlType: string;
  numberOfDownload: number;
  deprecated: boolean;
  isProtected: boolean;
  isSelected: boolean;
  previewUrl: string;
  chartLabels: string[];
  chartData: any[];
  chartDataLoading: boolean;
  openEvent: string;
  openProperty: string;
  openButtonIcon: string;
  openButtonTooltip: string;
}


export interface DatasetService {

  dataset: DatasetDTO;

  loadDataset(id: string) : Promise<DatasetDTO>;

  patchDatasetChanges(
    datasetId: string,
    data: object,
  ) : Promise<any>;

  createResource?(resourceData: ResourceDTO): Promise<ResourceDTO>;

  createDataset() : Promise<DatasetDTO>;

}
