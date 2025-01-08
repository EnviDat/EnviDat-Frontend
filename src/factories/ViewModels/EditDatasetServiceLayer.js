
// subscribe to viewModel and make the patch action?
// create the datasetDTO
// update all the viewModel from the datasetDTO

import axios from 'axios';

import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel';
import { ACTION_METADATA_EDITING_PATCH_DATASET } from '@/modules/user/store/userMutationsConsts';
import { urlRewrite } from '@/factories/apiFactory';
import { reactive, watch } from 'vue';

// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT || '';
}


const viewModelClasses = [
  EditHeaderViewModel,
]

const viewModelInstances = new Map();
const subscribers = new Map();

let metadataId = '';

function updateViewModels(datasetDTO) {
  viewModelInstances.forEach((model) => model.updateModel(datasetDTO))
}

async function patchDatasetChanges(viewModel) {

  const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
  const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

  const postData = viewModel.backendJSON;
  postData.id = metadataId;

  const response = await axios.post(url, postData,
  {
    headers: {
      // Authorization: apiKey,
    },
  });

  if (response?.data) {
    updateViewModels(response.data);
  }
}

/*
function getEditHeaderViewModel(datasetDTO = undefined) {
  const ehVM = createEditHeaderViewModel(datasetDTO, patchDatasetChanges);

}
*/

export function getViewModels() {
  return viewModelInstances;
}

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

export function init(datasetDTO) {
  metadataId = datasetDTO.id;

  for (let i = 0; i < viewModelClasses.length; i++) {
    const vmClass = viewModelClasses[i];
    // eslint-disable-next-line new-cap
    const instance = new vmClass(datasetDTO);
    const reactiveVM = reactive(instance);

    watch(() => reactiveVM, (newModel, oldModel) => {
      notifySubscribers(newModel, oldModel);
    }, { deep: true });

    // reactiveVM.subscribe(patchDatasetChanges);
    subscribe(vmClass.toString(), patchDatasetChanges);

    viewModelInstances.set(vmClass.toString(), reactiveVM);
  }
}
