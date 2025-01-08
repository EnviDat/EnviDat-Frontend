
// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel';
import { ACTION_METADATA_EDITING_PATCH_DATASET } from '@/modules/user/store/userMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { reactive } from 'vue';
import { DatasetDTO } from '@/factories/ViewModels/DatasetDTO';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT || '';
}

export class EditDatasetServiceLayer {

  viewModelClasses = [
    EditHeaderViewModel,
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


  // eslint-disable-next-line class-methods-use-this
  async patchDatasetChanges (datasetId, viewModel) {

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

  /*
  function getEditHeaderViewModel(datasetDTO = undefined) {
    const ehVM = createEditHeaderViewModel(datasetDTO, patchDatasetChanges);

  }
  */

  get viewModels() {
    return this.viewModelInstances;
  }

  /*
  export function subscribe(id, callbackFunction) {
    const subs = subscribers.get(id);
    if (subs) {
      subs.push(callbackFunction);
      return
    }

    subscribers.set(id, [callbackFunction]);
  }

  export function unsubscribe(id, callbackFunction) {
    const subs = subscribers.get(id);
    if (subs) {
      const index = subs.indexOf(callbackFunction);
      if (index >= 0) {
        subs.splice(index, 1);
      }
    }

  }

  function notifySubscribers(newModel, oldModel) {
    const subs = subscribers.get(oldModel.toString());
    if (!subs) {
      return
    }

    for (let i = 0; i < subs.length; i++) {
      const sub = subs[i];
      if (typeof sub === 'function') {
        sub(newModel);
      } else {
        throw new Error(`Wrong type of subscriber ${typeof sub}`);
      }
    }
  }
  */

}
