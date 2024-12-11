import { reactive } from 'vue';
import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_FULLNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
} from '@/factories/metadataConsts';

import { getAuthorName } from '@/factories/authorFactory';
import { formatDate } from '@/factories/dateFactory';
import { getMetadataVisibilityState } from '@/factories/publicationFactory';
import { AuthorsViewModel } from '@/factories/ViewModels/AuthorsViewModel';

/*
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
*/

export class HeaderViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO, smallScreen, categoryColor, titleImg, authorDeadInfo) {
    super(datasetDTO, HeaderViewModel.mappingRules());

    this.created = formatDate(this.created);
    this.modified = formatDate(this.modified);

    this[METADATA_CONTACT_FULLNAME] = getAuthorName({
      firstName: this[METADATA_CONTACT_FIRSTNAME],
      lastName: this[METADATA_CONTACT_LASTNAME],
    });

    this.authors = AuthorsViewModel.getFormattedAuthors(datasetDTO.author);

    this.authorDeadInfo = authorDeadInfo;
    this.categoryColor = categoryColor;
    this.titleImg = titleImg;
    this.maxTags = smallScreen ? 1 : 12;

    this.metadataState = getMetadataVisibilityState(this);
  }

  static mappingRules () {
    return [
      [METADATA_TITLE_PROPERTY,'title'],
      [METADATA_CONTACT_EMAIL,'maintainer.email'],
      [METADATA_CONTACT_FIRSTNAME,'maintainer.given_name'],
      [METADATA_CONTACT_LASTNAME,'maintainer.name'],
      ['doi','doi'],
      ['tags','tags'],
//      ['authorsRaw','author'],
//      ['authors','author'],
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
  }
}

export const createHeaderViewModel = (datasetDTO, smallScreen, categoryColor, titleImg, authorDeadInfo = null) => {
  const headerVM = new HeaderViewModel(datasetDTO, smallScreen, categoryColor, titleImg, authorDeadInfo);

  return reactive(headerVM);
}

