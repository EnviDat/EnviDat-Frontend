import { reactive, watch } from 'vue';
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
import { Author, DatasetDTO } from '@/types/modelTypes';


export class HeaderViewModel extends AbstractBaseViewModel{

  declare metadataTitle: string;

  declare contactEmail: string;
  declare contactGivenName: string;
  declare contactSurname: string;

  declare doi: string;

  declare tags: any[];

  declare organization: string;
  declare organizationTooltip: string;

  declare spatialInfo: string;

  declare state: string;
  declare private: boolean;
  declare metadataState: string;

  declare publicationYear: string;
  declare publicationStatus: string;

  declare created: string;
  declare modified: string;

  declare authors: Author[];

  declare categoryColor: any;
  declare titleImg: any;

  declare maxTags: number;

  constructor(dataset: DatasetDTO, smallScreen, categoryColor, titleImg) {
    super(dataset, HeaderViewModel.mappingRules());

    this.created = formatDate(this.created);
    this.modified = formatDate(this.modified);

    this[METADATA_CONTACT_FULLNAME] = getAuthorName({
      firstName: this[METADATA_CONTACT_FIRSTNAME],
      lastName: this[METADATA_CONTACT_LASTNAME],
    });

    this.authors = AuthorsViewModel.getFormattedAuthors(dataset.author, dataset.metadata_modified);

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
//      ['rawAuthors','author'],
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

export const createHeaderViewModel = (dataset: DatasetDTO, smallScreen, categoryColor, titleImg, changeCallback = undefined) => {
  const headerVM = new HeaderViewModel(dataset, smallScreen, categoryColor, titleImg);
  const reactiveVM = reactive(headerVM);

  if (changeCallback) {
    watch(() => reactiveVM, (newModel) => {
        changeCallback(newModel);
    }, { deep: true });
  }

  return reactiveVM;
}

