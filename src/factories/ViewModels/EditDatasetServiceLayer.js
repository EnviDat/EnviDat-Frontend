
// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import { reactive } from 'vue';
import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel';
import { ACTION_METADATA_EDITING_PATCH_DATASET } from '@/modules/user/store/userMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { DatasetDTO } from '@/factories/ViewModels/DatasetDTO';
import { HeaderViewModel } from '@/factories/ViewModels/HeaderViewModel';
import { AuthorsViewModel } from '@/factories/ViewModels/AuthorsViewModel';
import { EditDescriptionViewModel } from '@/factories/ViewModels/EditDescriptionViewModel';
import { EditKeywordsViewModel } from '@/factories/ViewModels/EditKeywordsViewModel';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

let mockDataResponse;
if (useTestdata) {
  mockDataResponse = await import('../../../public/testdata/dataset_10-16904-1');
}


if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT || '';
}

export class EditDatasetServiceLayer {

  viewModelClasses = [
    EditHeaderViewModel,
    HeaderViewModel,
    AuthorsViewModel,
    EditDescriptionViewModel,
    EditKeywordsViewModel,
  ];

  viewModelInstances = new Map();

  datasetDTO;

  constructor(datasetBackend) {

    this.datasetDTO = new DatasetDTO(datasetBackend, this);

    for (let i = 0; i < this.viewModelClasses.length; i++) {
      const vmClass = this.viewModelClasses[i];
      // eslint-disable-next-line new-cap
      const instance = new vmClass(this.datasetDTO);
      const reactiveVM = reactive(instance);

      this.viewModelInstances.set(instance.constructor.name, reactiveVM);
    }

    this.datasetDTO.subscribeToViewModels(this.viewModelInstances);
  }


  async patchDatasetChanges (datasetId, viewModel) {

    if (useTestdata) {
      return mockDataResponse.dataset.result;
    }

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = viewModel.backendJSON;
    postData.id = datasetId;

    const response = await axios.post(url, postData,
      {
        headers: {
          // Authorization: apiKey,
        },
      });

    return response.data
  }

  get viewModels() {
    return this.viewModelInstances;
  }

  getViewModel(modelName) {
    return this.viewModelInstances.get(modelName);
  }

}
