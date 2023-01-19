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

/*
import {
//  mapFrontendToBackend,
  populateEditingComponents,
} from '@/factories/mappingFactory';
*/

import { EDITMETADATA_DATA_RESOURCE } from '@/factories/eventBus';
import {
  METADATA_CREATION_RESOURCE,
  METADATA_CREATION_RESOURCE_SUCCESS,
  METADATA_CREATION_RESOURCE_ERROR,
  ACTION_METADATA_CREATION_RESOURCE,
  METADATA_DELETE_RESOURCE,
  ACTION_METADATA_DELETE_RESOURCE,
  METADATA_DELETE_RESOURCE_SUCCESS,
  METADATA_DELETE_RESOURCE_ERROR,
} from './userMutationsConsts';

// don't use an api base url or proxy when using testdata
let API_BASE = '';
let ENVIDAT_PROXY = '';

const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

if (!useTestdata) {
  API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/action/';
  ENVIDAT_PROXY = import.meta.env.VITE_ENVIDAT_PROXY;
}


export default {
  // async [METADATA_CREATION_RESOURCE]({ commit }, { stepKey, data, id }) {
  async [METADATA_CREATION_RESOURCE]({ commit }, { metadataId, file, fileUrl }) {

    commit(METADATA_CREATION_RESOURCE, metadataId);

/*
    const apiKey = this.state.userSignIn.user?.apikey || null;
    const categoryCards = this.state.categoryCards;
*/

    const actionUrl = ACTION_METADATA_CREATION_RESOURCE();
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

    // const postData = mapFrontendToBackend(stepKey, data);
    const size = file.size || 0;
    const name = file.name || file || fileUrl;

    const postData = {
      package_id: metadataId,
      url: fileUrl || file.name || file,
      description: null,
      format: file.extension || 'url',
      mimetype: file.type || '',
      name,
      size,
      url_type: 'upload',
      'resource_size-size_value': size / 1024 / 1024,
      'resource_size-size_units': 'mb',
      'restricted-level': null,
      'restricted-allowed_users': null,
      'restricted-shared_secret': null,
      doi: null,
      // publication_state: null,
      multipart_name: file.name,
    };


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
        // stepKey,
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
    const url = urlRewrite(actionUrl, API_BASE, ENVIDAT_PROXY);

    await axios.post(url, postData,
      {
        headers: {
          // Authorization: apiKey,
        },
      })
      .then((response) => {
        commit(METADATA_DELETE_RESOURCE_SUCCESS, {
          // stepKey,
          message: 'Resource deleted',
          // details: `Changes saved ${stepKey} data for ${id}`,
        });

        return true;
      })
      .catch((reason) => {
        commit(METADATA_DELETE_RESOURCE_ERROR, {
          // stepKey,
          reason,
        });

        return false;
      });
  },
};
