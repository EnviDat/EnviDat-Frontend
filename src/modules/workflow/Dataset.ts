import { convertJSON } from '@/factories/mappingFactory';
import type { AuthorDTO, DatasetDTO, OrganizationDTO, KeywordDTO, ExtrasDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';

export class Dataset implements DatasetDTO {

  author: AuthorDTO[] = [];
  author_email: string | null = null;
  creator_user_id: string = '';
  date: string = '';
  doi: string = '';
  funding: string = '';
  id: string = '';
  isopen: boolean = false;
  license_id: string = '';
  license_title: string = '';
  license_url: string = '';
  maintainer: AuthorDTO = {} as AuthorDTO;
  maintainer_email: string | null = null;
  metadata_created: string = '';
  metadata_modified: string = '';
  name: string = '';
  notes: string = '';
  num_resources: number = 0;
  num_tags: number = 0;
  organization: OrganizationDTO = {} as OrganizationDTO;
  owner_org: string = '';
  private: boolean = false;
  publication: string = '';
  resource_type: string = '';
  resource_type_general: string = '';
  spatial: string = '';
  spatial_info: string = '';
  state: string = '';
  subtitle: string = '';
  tags: KeywordDTO[] = [];
  title: string = '';
  type: string = '';
  url: string | null = null;
  version: string = '';
  extras: ExtrasDTO[] = [];
  resources: ResourceDTO[] = [];

  constructor(datasetBackend: DatasetDTO) {
    if (datasetBackend) {
      this.convertBackendDataset(datasetBackend);
    }
  }

  convertBackendDataset(datasetBackend: unknown) {
    const unpackedJson = convertJSON(datasetBackend, false);
    Object.assign(this, unpackedJson);
  }

}
