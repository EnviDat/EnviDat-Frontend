import { AbstractEditViewModel } from '@/factories/ViewModels/AbstractEditViewModel.ts';

export interface ResourceSizeDTO {
  size_value: string;
  size_units: string;
}

export interface RestrictedDTO {
  shared_secret: string,
  allowed_users: string,
  level: string;
}

export interface KeywordDTO {
  id: string;
  name: string;
  display_name: string;
  state: string;
  vocabulary_id: string | null;
  color: string;
}

export interface ResourceDTO {
  cache_last_updated: string | null;
  cache_url: string | null;
  created: string;
  description: string;
  doi: string;
  format: string;
  hash: string;
  id: string;
  last_modified: string;
  metadata_modified: string | null;
  mimetype: string;
  mimetype_inner: string | null;
  name: string;
  /** package id is the unique datasets id */
  package_id: string;
  position: number;
  resource_size: string;
  resource_type: string | null;
  restricted: string;
  size: number;
  state: string;
  url: string;
  url_type: string;
}

export interface ExtrasDTO {
  key: string;
  value: string;
}

export interface PublicationDTO {
  publisher: string;
  publication_year: string;
}

export interface OrganizationDTO {
  id: string;
  name: string;
  title: string;
  type: string;
  description: string;
  image_url: string;
  created: string;
  is_organization: boolean
  approval_status: string;
  state: string;
}

export interface AuthorDTO {
  name: string;
  given_name: string;
  identifier?: string;
  identifier_scheme?: string;
  email: string;
  affiliation: string;
  affiliation_02?: string;
  affiliation_03?: string;
  data_credit?: string[];
}

export interface DatasetDTO {
  author: AuthorDTO[];
  author_email: string | null;
  creator_user_id: string;
  date: string;
  doi: string;
  funding: string;
  id: string;
  isopen: boolean;
  license_id: string;
  license_title: string;
  license_url: string;
  maintainer: AuthorDTO;
  maintainer_email: string | null;
  metadata_created: string;
  metadata_modified: string;
  name: string;
  notes: string;
  num_resources: number;
  num_tags: number;
  organization: OrganizationDTO;
  /** owner_org is the organization id */
  owner_org: string;
  private: boolean;
  publication: string;
  resource_type: string;
  resource_type_general: string;
  /** spatial is the GeoJson either a GeometryCollection is single Geometries */
  spatial: string;
  spatial_info: string;
  state: string;
  subtitle: string;
  tags: KeywordDTO[];
  title: string;
  type: string;
  url: string | null;
  version: string;
  extras: ExtrasDTO[],
  resources: ResourceDTO[];
}

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
