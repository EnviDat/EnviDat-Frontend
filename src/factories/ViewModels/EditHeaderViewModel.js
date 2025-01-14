import { AbstractBaseViewModel } from '@/factories/ViewModels/AbstractBaseViewModel';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';


export class EditHeaderViewModel extends AbstractBaseViewModel{

  constructor(datasetDTO) {
    super(datasetDTO, EditHeaderViewModel.mappingRules());
  }

  static mappingRules () {
    return [
      [METADATA_TITLE_PROPERTY,'title'],
      [METADATA_URL_PROPERTY,'name'],
      [METADATA_CONTACT_EMAIL,'maintainer.email'],
      [METADATA_CONTACT_FIRSTNAME,'maintainer.given_name'],
      [METADATA_CONTACT_LASTNAME,'maintainer.name'],
      ['license','license_title'],
    ];
  }
}
