import { reactive, watch } from 'vue';

import { getAuthorName } from '@/factories/authorFactory';
import { formatDate } from '@/factories/dateFactory';
import { getMetadataVisibilityState } from '@/factories/publicationFactory';
import { AuthorsViewModel } from '@/factories/ViewModels/AuthorsViewModel';
import { Author } from '@/types/modelTypes';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { AbstractViewModel } from '@/factories/ViewModels/AbstractViewModel';

export class HeaderViewModel extends AbstractViewModel {
  declare metadataTitle: string;

  declare contactEmail: string;
  declare contactName: string;

  declare contactFirstName: string;
  declare contactLastName: string;

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

  constructor(dataset: DatasetDTO, smallScreen: boolean, categoryColor: string, titleImg: string) {
    super(dataset, HeaderViewModel.mappingRules());

    this.created = formatDate(this.created);
    this.modified = formatDate(this.modified);

    this.contactName = getAuthorName({
      firstName: this.contactFirstName,
      lastName: this.contactLastName,
    });

    this.authors = AuthorsViewModel.getFormattedAuthors(dataset.author, dataset.metadata_modified);

    this.categoryColor = categoryColor;
    this.titleImg = titleImg;
    this.maxTags = smallScreen ? 1 : 12;

    this.metadataState = getMetadataVisibilityState(this);
  }

  static mappingRules() {
    return [
      ['metadataTitle', 'title'],
      ['contactEmail', 'maintainer.email'],
      ['contactFirstName', 'maintainer.given_name'],
      ['contactLastName', 'maintainer.name'],
      ['doi', 'doi'],
      ['tags', 'tags'],
      //      ['rawAuthors','author'],
      //      ['authors','author'],
      ['organization', 'organization.name'],
      ['organizationTooltip', 'organization.title'],
      ['spatialInfo', 'spatial_info'],
      ['state', 'state'],
      ['private', 'private'],
      ['publicationYear', 'publication.publication_year'],
      ['publicationStatus', 'publication_state'],
      ['created', 'metadata_created'],
      ['modified', 'metadata_modified'],
    ];
  }
}

export const createHeaderViewModel = (
  dataset: DatasetDTO,
  smallScreen: boolean,
  categoryColor: string,
  titleImg: string,
  changeCallback = undefined,
) => {
  const headerVM = new HeaderViewModel(dataset, smallScreen, categoryColor, titleImg);
  const reactiveVM = reactive(headerVM);

  if (changeCallback) {
    watch(
      () => reactiveVM,
      (newModel) => {
        changeCallback(newModel);
      },
      { deep: true },
    );
  }

  return reactiveVM;
};
