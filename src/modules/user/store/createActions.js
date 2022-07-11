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

import {
  mapFrontendToBackend,
  populateEditingComponents,
} from '@/factories/mappingFactory';

import {
  ACTION_METADATA_EDITING_PATCH_DATASET,
  METADATA_CREATION_RESOURCE,
  METADATA_CREATION_RESOURCE_SUCCESS,
  METADATA_CREATION_RESOURCE_ERROR,
} from './userMutationsConsts';

// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = process.env.VUE_APP_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = '/api/action/';
  ENVIDAT_PROXY = process.env.VUE_APP_ENVIDAT_PROXY;
}


export default {
  async [METADATA_CREATION_RESOURCE]({ commit }, { stepKey, data, id }) {

    commit(METADATA_CREATION_RESOURCE, stepKey);

    const apiKey = this.state.userSignIn.user?.apikey || null;
    const categoryCards = this.state.categoryCards;

    const actionUrl = ACTION_METADATA_EDITING_PATCH_DATASET();
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

    const postData = mapFrontendToBackend(stepKey, data);

    await axios.post(url, postData,
      {
        headers: {
          Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_CREATION_RESOURCE_SUCCESS, {
          stepKey,
          message: 'Changes saved',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

        populateEditingComponents(commit, response.data.result, categoryCards);
      })
      .catch((reason) => {
        commit(METADATA_CREATION_RESOURCE_ERROR, {
          stepKey,
          reason,
        });
      });
  },
};
