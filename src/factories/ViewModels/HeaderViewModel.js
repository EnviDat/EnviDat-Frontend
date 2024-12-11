import { reactive } from 'vue';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

import { METADATA_CONTACT_EMAIL, METADATA_TITLE_PROPERTY } from '@/factories/metadataConsts';

const mappingRules = [
  [METADATA_TITLE_PROPERTY,'title'],
  [METADATA_CONTACT_EMAIL,'maintainer.email'],
  ['firstName','maintainer.given_name'],
  ['lastName','maintainer.name'],
  ['doi','doi'],
  ['tags','tags'],
  ['authors','author'],
  ['organization','organization.name'],
  ['organizationTooltip','organization.title'],
  ['spatialInfo','spatial_info'],
  ['created','metadata_created'],
  ['modified','metadata_modified'],
  ['state','state'],
  ['private','private'],
];

class HeaderViewModel extends AbstractBaseViewModel{
  constructor(datasetDTO) {
    super(datasetDTO, mappingRules);
  }
}


export const createHeaderViewModel = (datasetDTO) => {
  const headerVM = new HeaderViewModel(datasetDTO);

  return reactive(headerVM);
}

