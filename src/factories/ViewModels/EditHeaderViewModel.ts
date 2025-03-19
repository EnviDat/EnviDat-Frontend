import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel.ts';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';
import { DatasetDTO } from '@/types/modelTypes';


export class EditHeaderViewModel extends AbstractBaseViewModel{

  declare metadataTitle: string;
  declare metadataUrl: string;

  declare contactEmail: string;
  declare contactFirstName: string;
  declare contactLastName: string;

  declare license: string;

  constructor(dataset: DatasetDTO) {
    super(dataset, EditHeaderViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      ['metadataTitle','title'],
      ['metadataUrl','name'],
      ['contactEmail','maintainer.email'],
      ['contactFirstName','maintainer.given_name'],
      ['contactLastName','maintainer.name'],
      ['license','license_title'],
    ];
  }
}
