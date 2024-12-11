import { reactive } from 'vue';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
} from '@/factories/metadataConsts';

const mappingRules = [
  [METADATA_TITLE_PROPERTY,'title'],
  [METADATA_CONTACT_EMAIL,'maintainer.email'],
  [METADATA_CONTACT_FIRSTNAME,'maintainer.given_name'],
  [METADATA_CONTACT_LASTNAME,'maintainer.name'],
  ['doi','doi'],
  ['tags','tags'],
  ['authors','author'],
  ['organization','organization.name'],
  ['organizationTooltip','organization.title'],
  ['spatialInfo','spatial_info'],
  ['state','state'],
  ['private','private'],
  ['publicationYear','publication.publication_year'],
  ['publicationStatus','publication_state'],
  ['created','metadata_created'],
  ['modified','metadata_modified'],
];

class HeaderViewModel extends AbstractBaseViewModel{
  constructor(datasetDTO) {
    super(datasetDTO, mappingRules);

/*
    authorDeadInfo,
      categoryColor: dataset.categoryColor,
      titleImg: dataset.titleImg,
      maxTags: smallScreen ? 1 : 12,
*/
  }
}

export const createHeaderViewModel = (datasetDTO) => {
  const headerVM = new HeaderViewModel(datasetDTO);

  return reactive(headerVM);
}

