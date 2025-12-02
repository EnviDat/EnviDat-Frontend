import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

export type UserPickerObject = {
  fullName: string;
  email: string;
};

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
  /* firstName is enhanced by the frontend */
  firstName: string;
  /* lastName is enhanced by the frontend */
  lastName: string;
  /* fullName is enhanced by the frontend */
  fullName: string;
  email: string;
  dataCredit: string[];
  identifierType: string;
  identifier: string;
  affiliation: string;
  datasetCount: number;
  totalDataCredits: DataCreditObject;
  isSelected: boolean;
  isAuthorDead: boolean;
}

export interface Keyword {
  name: string;
  enabled: boolean;
  color?: string;
  count: number;
  active?: boolean;
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
  /* firstName is enhanced by the frontend */
  firstName: string;
  /* lastName is enhanced by the frontend */
  lastName: string;
  fullName: string;
  /* dataset are only loaded if the api is given "include_datasets=true" */
  datasets: DatasetDTO[] | undefined;
  name: string;
  email: string;
  emailHash: string;
  created: string;
  modified: string;
  imageUrl: string;
  imageDisplayUrl: string;
  about: string;
  sysadmin: boolean;
  state: string;
}

export type ResourceSize = {
  sizeValue: string;
  sizeUnits: string;
};

export interface Resource {
  // cacheLastUpdated: string | null;
  // cacheUrl: string | null;
  created: string;
  description: string;
  doi: string;
  format: string;
  // hash: string;
  id: string;
  datasetId: string;
  lastModified: string;
  metadataModified: string | null;
  mimetype: string;
  mimetypeInner: string | null;
  name: string;
  position: number;
  resourceSize: ResourceSize;
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

  loadDataset(id: string): Promise<DatasetDTO>;

  patchDatasetChanges(datasetId: string, data: object): Promise<any>;

  createResource?(resourceData: ResourceDTO): Promise<ResourceDTO>;

  deleteResource(resourceId: string): Promise<boolean>;

  createDataset(dataset?: DatasetDTO, user?: User): Promise<DatasetDTO>;
}

export type Tag = {
  name: string;
  enabled: boolean;
  color?: string;
};
