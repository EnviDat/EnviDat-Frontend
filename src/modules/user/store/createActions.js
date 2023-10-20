/**
 * user store actions
 *
 * @summary user store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:48:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { urlRewrite } from '@/factories/apiFactory';

import { EDITMETADATA_DATA_RESOURCE } from '@/factories/eventBus';
import {
  getBackendJSONForStep,
  stringifyResourceForBackend,
} from '@/factories/mappingFactory';

import {
  METADATA_CREATION_RESOURCE,
  METADATA_CREATION_RESOURCE_SUCCESS,
  METADATA_CREATION_RESOURCE_ERROR,
  ACTION_METADATA_CREATION_RESOURCE,
  METADATA_DELETE_RESOURCE,
  ACTION_METADATA_DELETE_RESOURCE,
  METADATA_CREATION_DATASET,
  METADATA_CREATION_DATASET_SUCCESS,
  METADATA_CREATION_DATASET_ERROR,
  ACTION_METADATA_CREATION_DATASET,
} from './userMutationsConsts';


// don't use an api base url or API_ROOT when using testdata
let API_BASE = '';
let API_ROOT = '';

const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  API_ROOT = import.meta.env.VITE_API_ROOT;
}


export default {
  // async [METADATA_CREATION_RESOURCE]({ commit }, { stepKey, data, id }) {
  async [METADATA_CREATION_RESOURCE]({ commit }, { data }) {

    commit(METADATA_CREATION_RESOURCE);

    const actionUrl = ACTION_METADATA_CREATION_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const cleaned = getBackendJSONForStep(EDITMETADATA_DATA_RESOURCE, data);
    const postData = stringifyResourceForBackend(cleaned);

    try {
      const response = await axios.post(url, postData);

      const resource = response.data.result;

      commit(METADATA_CREATION_RESOURCE_SUCCESS, {
        stepKey: EDITMETADATA_DATA_RESOURCE,
        resource,
        message: 'Resource created',
        // details: `Changes saved ${stepKey} data for ${id}`,
      });

    } catch(reason) {
      commit(METADATA_CREATION_RESOURCE_ERROR, {
        stepKey: EDITMETADATA_DATA_RESOURCE,
        reason,
      });
    }
  },
  async [METADATA_DELETE_RESOURCE]({ commit }, resourceId) {
    commit(METADATA_DELETE_RESOURCE);

    const postData = {
      id: resourceId,
    };

    const actionUrl = ACTION_METADATA_DELETE_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    await axios.post(url, postData,
      {
        headers: {
          // Authorization: apiKey,
        },
      })
      .then(() => true)
      .catch(() => false)
  },
  async [METADATA_CREATION_DATASET]({ commit }, data) {

    commit(METADATA_CREATION_DATASET);

    const actionUrl = ACTION_METADATA_CREATION_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, API_ROOT);

    const postData = data;

    try {
      const response = await axios.post(url, postData);

      const dataset = response.data.result;

      commit(METADATA_CREATION_DATASET_SUCCESS, {
        dataset,
        message: 'Dataset created',
      });

    } catch(reason) {
      commit(METADATA_CREATION_DATASET_ERROR, {
        reason,
      });
    }

  },
};
